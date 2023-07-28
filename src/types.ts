export enum DhanEnv {
    PROD = "PROD",
    SANDBOX = "SANDBOX"
}

export type DhanHqConfig = {
    accessToken: string;
    env: DhanEnv;
};

export enum DrvOptionType {
    CALL = "CALL",
    PUT = "PUT"
}

export enum Exchange {
    NSE = "NSE",
    BSE = "BSE"
}

export enum ExchangeSegment {
    NSE_EQ = "NSE_EQ",
    NSE_FNO = "NSE_FNO",
    NSE_CURRENCY = "NSE_CURRENCY",
    BSE_EQ = "BSE_EQ",
    MCX_COMM = "MCX_COMM",
    IDX_I = "IDX_I"
}

export enum Instrument {
    EQUITY = "EQUITY",
    FUTCOM = "FUTCOM",
    FUTCUR = "FUTCUR",
    FUTIDX = "FUTIDX",
    FUTSTK = "FUTSTK",
    INDEX = "INDEX"
}

export enum ProductType {
    CNC = "CNC",
    INTRADAY = "INTRADAY",
    MARGIN = "MARGIN",
    CO = "CO",
    BO = "BO",
    MTF = "MTF"
}

export type EdisStatusInquiryDetails = {
    clientId: string;
    isin: string;
    totalQty: number;
    aprvdQty: number;
    status: string;
    remarks: string;
}

export type EdisTpinRequest = {
    isin: string;
    qty: number;
    exchange: Exchange
    segment: string;
    bulk: boolean
}


export type EdisTpinResponse = {
    dhanClientId: string;
    edisFormHtml: string;
}

export type FundLimitDetails = {
    dhanClientId: string;
    availabelBalance: number;
    sodLimit: number;
    collateralAmount: number;
    receiveableAmount: number;
    utilizedAmount: number;
    blockedPayoutAmount: number;
    withdrawableBalance: number;
}

export type DailyHistoricalDataRequest = {
    symbol: string;
    exchangeSegment: ExchangeSegment;
    instrument: Instrument;
    expiryCode: string;
    fromDate: string;
    toDate: string;
}

export type HistoricalDataResponse = {
    open: Array<number>;
    high: Array<number>;
    low: Array<number>;
    close: Array<number>;
    volume: Array<number>;
    start_time: Array<number>;
}

export type IntradayHistoricalDataRequest = {
    securityId: string;
    exchangeSegment: ExchangeSegment;
    instrument: string;
}

export enum AmoTime {
    OPEN = "OPEN",
    OPEN_30 = "OPEN_30",
    OPEN_60 = "OPEN_60"
}

export enum LegName {
    ENTRY_LEG = "ENTRY_LEG",
    TARGET_LEG = "TARGET_LEG",
    STOP_LOSS_LEG = "STOP_LOSS_LEG"
}

export type OrderDetail = {
    dhanClientId: string;
    orderId: number;
    exchangeOrderId: number;
    correlationId: string;
    orderStatus: OrderStatus;
    transactionType: TransactionType;
    exchangeSegment: ExchangeSegment;
    productType: ProductType;
    orderType: OrderType;
    validity: Validity;
    tradingSymbol: string;
    securityId: string;
    quantity: number;
    disclosedQuantity: number;
    price: number;
    triggerPrice: number;
    afterMarketOrder: boolean;
    boProfitValue: number;
    boStopLossValue: number;
    legName: LegName;
    createTime: string;
    updateTime: string;
    exchangeTime: string;
    drvExpiryDate: string;
    drvOptionType: DrvOptionType;
    drvStrikePrice: number;
    omsErrorCode: string;
    omsErrorDescription: string;
    filled_qty: number;
    algoId: number;
    amoTime: AmoTime;
    exchangeTradeId: string;
    tradedQuantity: number;
    tradedPrice: number;
}

export type OrderResponse = {
    orderId: string;
    orderStatus: OrderStatus;
    errorCode: string;
    httpStatus: string;
    internalErrorCode: string;
    internalErrorMessage: string;
}

export enum OrderStatus {
    TRANSIT = "TRANSIT",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    TRADED = "TRADED",
    EXPIRED = "EXPIRED"
}

export enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET",
    STOP_LOSS = "STOP_LOSS",
    STOP_LOSS_MARKET = "STOP_LOSS_MARKET"
}

export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL"
}

export enum Validity {
    DAY = "DAY",
    IOC = "IOC"
}

export type ConvertPositionRequest = {
    dhanClientId: string;
    fromProductType: ProductType;
    exchangeSegment: ExchangeSegment;
    positionType: PositionType;
    securityId: string;
    tradingSymbol: string;
    convertQty: number;
    toProductType: ProductType;
}

export type HoldingsDetail = {
    exchange: string;
    tradingSymbol: string;
    securityId: string;
    isin: string;
    totalQty: number;
    dpQty: number;
    t1Qty: number;
    availableQty: number;
    collateralQty: number;
    avgCostPrice: number;
}

export type PositionDetail = {
    dhanClientId: string;
    tradingSymbol: string;
    securityId: string;
    positionType: PositionType;
    exchangeSegment: ExchangeSegment;
    productType: ProductType;
    buyAvg: number;
    buyQty: number;
    sellAvg: number;
    sellQty: number;
    netQty: number;
    realizedProfit: number;
    unrealizedProfit: number;
    rbiReferenceRate: number;
    multiplier: number;
    carryForwardBuyQty: number;
    carryForwardSellQty: number;
    carryForwardBuyValue: number;
    carryForwardSellValue: number;
    dayBuyQty: number;
    daySellQty: number;
    dayBuyValue: number;
    daySellValue: number;
    drvExpiryDate: string;
    drvOptionType: DrvOptionType;
    drvStrikePrice: number;
    crossCurrency: boolean;
}

export enum PositionType {
    LONG = "LONG",
    SHORT = "SHORT",
    CLOSED = "CLOSED"
}

