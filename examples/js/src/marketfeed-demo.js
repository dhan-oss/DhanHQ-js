const {
    DhanFeed,
    IDX,
    NSE,
    Ticker,
    Quote,
    Depth,
    MCX,
    NSE_FNO,
    QuoteResponse,
    OiDataResponse,
    MarketStatusResponse,
    MarketDepthResponse,
    PrevCloseResponse,
    TickerResponse
} = require('dhanhq');
const process = require("process");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

const instruments = [
    [MCX, '428869'],
    [NSE_FNO, '65378']
];

let type = process.env['type'];
let subscriptionCode;

// Subscription code (e.g., Ticker, Quote, Depth)
if (type === 'quote') {
    subscriptionCode = Quote;
} else if (type === 'depth') {
    subscriptionCode = Depth;
} else if (type === 'ticker') {
    subscriptionCode = Ticker;
}

const onConnect = async (instance) => {
    console.log('Connected to DhanHQ WebSocket');
    console.log('Total instruments:', instruments.length);
    await instance.subscribe(subscriptionCode, instruments);

    setTimeout(async () => {
        console.log('Unsubscribing from symbols after 15 sec...');
        await instance.unsubscribe(subscriptionCode, [instruments[1]]);
    }, 15000);
};

const onMessage = async (instance, message) => {
    if (message instanceof QuoteResponse)
        console.log('Received message:', message.type);
    else if (message instanceof OiDataResponse)
        console.log('Received message:', message);
    else if (message instanceof MarketStatusResponse)
        console.log('Received message:', message);
    else if (message instanceof MarketDepthResponse)
        console.log('Received message:', message);
    else if (message instanceof PrevCloseResponse)
        console.log('Received message:', message);
    else if (message instanceof TickerResponse)
        console.log('Received message:', message);
    else
        console.log('Received message:', message);
};

const onClose = async (instance) => {
    console.log('WebSocket connection closed');
};

const dhanFeed = new DhanFeed(DHAN_CLIENT_ID, ACCESS_TOKEN, instruments, subscriptionCode, onConnect, onMessage, onClose);

dhanFeed.connect();

process.on('SIGINT', () => {
    dhanFeed.close();
    process.exit();
});