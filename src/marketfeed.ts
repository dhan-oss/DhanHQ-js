import {WebSocket} from 'ws';
import {Buffer} from 'buffer';
import {
    DepthLevel,
    MarketDepthResponse,
    MarketStatusResponse,
    OiDataResponse,
    PrevCloseResponse,
    QuoteResponse,
    TickerResponse
} from "./types";

const WSS_URL = 'wss://api-feed.dhan.co';
export const IDX = 0;
export const NSE = 1;
export const NSE_FNO = 2;
export const NSE_CURR = 3;
export const BSE = 4;
export const MCX = 5;
export const BSE_CURR = 7;
export const BSE_FNO = 8;
export const Ticker = 15;
export const Quote = 17;
export const Depth = 19;
const retryInterval = 5000

class DhanSDKHelper {
    sdkInstance: any;

    constructor(sdkInstance: any) {
        this.sdkInstance = sdkInstance;
    }

    async onConnectionEstablished(websocket: WebSocket) {
        if (this.sdkInstance.onConnect) {
            await this.sdkInstance.onConnect(this.sdkInstance);
        }
    }

    async onMessageReceived(response: any) {
        if (this.sdkInstance.onMessage) {
            await this.sdkInstance.onMessage(this.sdkInstance, response);
        }
    }

    async onClose(websocket: WebSocket, closeStatus: any = null, closeMsg: any = null) {
        console.log(`WebSocket closed with status ${closeStatus}: ${closeMsg}`);
        websocket.close();
        this.sdkInstance.ws = null;
        if (this.sdkInstance.onClose) {
            await this.sdkInstance.onClose(this.sdkInstance);
        }
    }
}

export class DhanFeed {
    clientId: string;
    accessToken: string;
    instruments: any[];
    subscriptionCode: number;
    private onConnect: any;
    private onMessage: any;
    private onClose: any;
    private ws: WebSocket | null;
    private sdkHelper: DhanSDKHelper;

    constructor(clientId: string, accessToken: string, instruments: any[], subscriptionCode: number, onConnect: any = null, onMessage: any = null, onClose: any = null) {
        this.clientId = clientId;
        this.accessToken = accessToken;
        this.instruments = instruments;
        this.subscriptionCode = subscriptionCode;
        this.onConnect = onConnect;
        this.onMessage = onMessage;
        this.onClose = onClose;
        this.ws = null;
        this.sdkHelper = new DhanSDKHelper(this);
    }

    padWithZeros(buffer: Buffer, length: number): Buffer {
        if (buffer.length < length) {
            const padding = Buffer.alloc(length - buffer.length, 0);
            return Buffer.concat([buffer, padding]);
        }
        return buffer;
    }

    async authorize(): Promise<void> {
        try {
            console.log("Authorizing your token...");
            let apiAccessToken = Buffer.from(this.accessToken, 'utf-8');
            apiAccessToken = this.padWithZeros(apiAccessToken, 500);
            const authenticationType = Buffer.from("2P", 'utf-8');
            const payload = Buffer.concat([apiAccessToken, authenticationType]);

            const feedRequestCode = 11;
            const messageLength = 83 + apiAccessToken.length + authenticationType.length;
            let clientIdBuffer = Buffer.from(this.clientId, 'utf-8');
            clientIdBuffer = this.padWithZeros(clientIdBuffer, 30);
            const dhanAuth = Buffer.alloc(50, 0);
            const header = Buffer.alloc(83);
            header.writeUInt8(feedRequestCode, 0);
            header.writeUInt16LE(messageLength, 1);
            clientIdBuffer.copy(header, 3, 0, 30);
            dhanAuth.copy(header, 33, 0, 50);

            const authorizationPacket = Buffer.concat([header, payload]);

            await this.ws.send(authorizationPacket);
            console.log("Authorization successful!");
        } catch (error) {
            console.log(`Authorization failed: ${error}`);
        }
    }

    async connect() {
        if (this.accessToken === '' || this.clientId === '') {
            console.error('Access Token or Client ID is missing');
            return;
        }

        this.ws = new WebSocket(WSS_URL, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            setTimeout(() => {
                console.log('WEBSOCKET_CLOSE: reconnecting...')
                this.connect()
            }, retryInterval)
        });

        this.ws.on('open', async () => {
            await this.authorize();
            console.log('WebSocket connection established & authorized successfully');
            await this.sdkHelper.onConnectionEstablished(this.ws!);
        });

        this.ws.on('message', async (data: any) => {
            let response;
            const responseCode = data.readUInt8(0);
            switch (responseCode) {
                case 2:
                    response = this.processTickerPacket(data);
                    break;
                case 3:
                    response = this.processMarketDepthPacket(data);
                    break;
                case 4:
                    response = this.processQuotePacket(data);
                    break;
                case 5:
                    response = this.processOIDataPacket(data);
                    break;
                case 6:
                    response = this.processPrevClosePacket(data);
                    break;
                case 7:
                    response = this.processMarketStatusPacket(data);
                    break;
                case 50:
                    this.processServerDisConnectionPacket(data);
                    process.exit();
                    break;
                default:
                    console.warn(`Unknown response code: ${responseCode}`);
                    response = null;
            }
            await this.sdkHelper.onMessageReceived(response);
        });

        this.ws.on('close', async (code, reason) => {
            console.log(`WebSocket closed with code ${code}: ${reason}`);
            await this.sdkHelper.onClose(this.ws!, code, reason.toString());
        });
    }

    async close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    private async send(payload: any) {
        if (this.ws) {
            this.ws.send(payload);
        }
    }

    private createHeader(feedRequestCode: number, messageLength: number, clientId: string) {
        const header = Buffer.alloc(83);
        header.writeInt16LE(feedRequestCode, 0);
        header.writeInt32LE(messageLength, 2);
        header.write(clientId, 6, 'utf-8');
        return header;
    }

    private async subscribeSymbols(feedRequestCode: number, symbols: any[]) {
        const uniqueSymbolsSet = new Set(this.instruments);
        symbols.forEach(symbol => uniqueSymbolsSet.add(symbol));
        this.instruments = Array.from(uniqueSymbolsSet);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const packet = this.createSubscriptionPacket(symbols, feedRequestCode, true);
            await this.send(packet);
        }
    }

    async subscribe(feedRequestCode: number, symbols: any[]) {
        const partitions = Math.ceil(symbols.length / 100);
        for (let i = 0; i < partitions; i++) {
            const start = i * 100;
            const end = Math.min((i + 1) * 100, symbols.length);
            const symbolBatch = symbols.slice(start, end);
            await this.subscribeSymbols(feedRequestCode, symbolBatch);
        }
    }

    private createSubscriptionPacket(instruments: [number, string][], feedRequestCode: number, status: boolean): Buffer {
        const numInstruments = instruments.length;
        const actualFeedRequestCode = status ? this.subscriptionCode : this.subscriptionCode + 1;

        const header = this.createHeader(actualFeedRequestCode, 83 + 4 + numInstruments * 21, this.clientId);
        const numInstrumentsBytes = Buffer.alloc(4);
        numInstrumentsBytes.writeInt32LE(numInstruments, 0);

        let instrumentInfo = Buffer.alloc(0);
        instruments.forEach(([exchangeSegment, securityId]) => {
            const segmentBuffer = Buffer.alloc(1);
            segmentBuffer.writeUInt8(exchangeSegment, 0);
            const securityIdBuffer = Buffer.alloc(20);
            securityIdBuffer.write(securityId, 0, 'utf-8');
            instrumentInfo = Buffer.concat([instrumentInfo, segmentBuffer, securityIdBuffer]);
        });

        const padding = Buffer.alloc((100 - numInstruments) * 21);
        instrumentInfo = Buffer.concat([instrumentInfo, padding]);

        const subscriptionPacket = Buffer.concat([header, numInstrumentsBytes, instrumentInfo]);
        return subscriptionPacket;
    }

    async unsubscribe(feedRequestCode: number, symbols: any) {
        this.instruments = this.instruments.filter(instrument =>
            !symbols.some(symbol =>
                symbol[0] === instrument[0] && symbol[1] === instrument[1]
            )
        );
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log("Unsubscribing from:", symbols);
            const unsubscribePacket = this.createUnsubscribePacket(feedRequestCode, symbols);
            await this.send(unsubscribePacket);
            console.log("Remaining subscribed instruments:", this.instruments);
        }
    }

    private createUnsubscribePacket(feedRequestCode: number, instruments: [number, string][]): Buffer {
        const numInstruments = instruments.length;
        const unsubscribeCode = feedRequestCode + 1; // Assuming unsubscribe code is feedRequestCode + 1

        const header = this.createHeader(unsubscribeCode, 83 + 4 + numInstruments * 21, this.clientId);
        const numInstrumentsBytes = Buffer.alloc(4);
        numInstrumentsBytes.writeInt32LE(numInstruments, 0);

        let instrumentInfo = Buffer.alloc(0);
        instruments.forEach(([exchangeSegment, securityId]) => {
            const segmentBuffer = Buffer.alloc(1);
            segmentBuffer.writeUInt8(exchangeSegment, 0);
            const securityIdBuffer = Buffer.alloc(20);
            securityIdBuffer.write(securityId, 0, 'utf-8');
            instrumentInfo = Buffer.concat([instrumentInfo, segmentBuffer, securityIdBuffer]);
        });

        const padding = Buffer.alloc((100 - numInstruments) * 21);
        instrumentInfo = Buffer.concat([instrumentInfo, padding]);

        return Buffer.concat([header, numInstrumentsBytes, instrumentInfo]);
    }

    private processTickerPacket(data: Buffer): TickerResponse {
        if (data.length >= 16) {
            const responseCode = data.readUInt8(0);
            const exchangeSegment = data.readUInt8(1);
            const securityId = data.readUInt32LE(4);
            const ltp = data.readFloatLE(8);
            const ltt = data.readUInt32LE(12);
            const tickerResponse: TickerResponse = new TickerResponse(
                'Ticker Packet',
                responseCode,
                exchangeSegment,
                securityId,
                Number(ltp.toFixed(2)),
                new Date(ltt * 1000).toISOString()
            );
            return tickerResponse;
        }
    }

    private processPrevClosePacket(data: Buffer): PrevCloseResponse {
        if (data.length >= 16) {
            const responseCode = data.readUInt8(0);
            const exchangeSegment = data.readUInt8(1);
            const securityId = data.readUInt32LE(4);
            const prevClosePrice = data.readFloatLE(8);
            const prevOpenInterest = data.readUInt32LE(12);
            const prevCloseResponse: PrevCloseResponse = new PrevCloseResponse(
                'Prev Close Packet',
                responseCode,
                exchangeSegment,
                securityId,
                Number(prevClosePrice.toFixed(2)),
                prevOpenInterest
            );
            return prevCloseResponse;
        }
    }

    private processMarketStatusPacket(data: Buffer): MarketStatusResponse {
        if (data.length >= 1) {
            const responseCode = data.readUInt8(0);
            const status = responseCode === 7 ? 'Market Open' : 'Market Close';
            const marketStatusResponse: MarketStatusResponse = new MarketStatusResponse(
                'Market Status Packet',
                responseCode,
                status
            );
            return marketStatusResponse;
        }
    }

    private processQuotePacket(data: Buffer): QuoteResponse {
        if (data.length >= 50) {
            const quoteResponse: QuoteResponse = new QuoteResponse(
                'Quote Packet',
                data.readUInt8(0),
                data.readUInt32LE(4),
                data.readFloatLE(8),
                data.readUInt16LE(12),
                new Date(data.readUInt32LE(14) * 1000).toISOString(),
                data.readFloatLE(18),
                data.readUInt32LE(22),
                data.readUInt32LE(26),
                data.readUInt32LE(30),
                data.readFloatLE(34),
                data.readFloatLE(38),
                data.readFloatLE(42),
                data.readFloatLE(46)
            );
            return quoteResponse;
        }
    }

    private processOIDataPacket(data: Buffer): OiDataResponse {
        if (data.length >= 12) {
            const oiData: OiDataResponse = new OiDataResponse(
                'OI Data Packet',
                data.readUInt8(0),
                data.readUInt8(1),
                data.readUInt32LE(4),
                data.readUInt32LE(8)
            );
            return oiData;
        }
    }

    private processMarketDepthPacket(data: Buffer): MarketDepthResponse {
        const headerLength = 13;
        const depthLevelSize = 20;
        const maxDepthLevels = 5;

        if (data.length < headerLength) {
            console.warn('Market Depth packet data is too short for header');
            return;
        }

        const result: MarketDepthResponse = new MarketDepthResponse(
            'Market Depth Packet',
            data.readUInt8(0),
            data.readFloatLE(8),
            []
        );

        for (let i = 0; i < 5; i++) {
            let offset = headerLength + i * depthLevelSize;
            offset = offset - 1;

            if (offset + depthLevelSize > data.length) break;
            const depthLevel: DepthLevel = new DepthLevel(
                data.readInt16LE(offset + 8),
                data.readInt32LE(offset),
                data.readFloatLE(offset + 12),
                data.readFloatLE(offset + 16),
                data.readInt32LE(offset + 4),
                data.readInt16LE(offset + 10)
            );
            result.depthLevels.push(depthLevel);
        }

        if (data.length < headerLength + maxDepthLevels * depthLevelSize) {
            console.warn(`Market Depth packet data is shorter than expected. Expected at least ${headerLength + maxDepthLevels * depthLevelSize} bytes, received ${data.length} bytes.`);
        }
        return result;
    }

    private processServerDisConnectionPacket(data: Buffer) {
        const errorCode = data.readUInt16LE(8);
        switch (errorCode) {
            case 805:
                console.log("Connection limit exceeded, Please close existing connection to create new connection");
                break;
            case 806:
                console.log("Data APIs not subscribed, Please subscribe tp continue using Market Feed APIs");
                break;
            case 807:
                console.log("Access token is expired, Please generate new access token");
                break;
            case 808:
                console.log("Authentication Failed - Check Client ID and Access Token");
                break;
            case 809:
                console.log("Access token is invalid or not found, Please generate new access token");
                break;
            default:
                console.log("Disconnected: Unknown reason for disconnection");
        }
        this.close();
    }
}
