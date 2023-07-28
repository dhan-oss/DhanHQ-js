import * as dotenv from 'dotenv'
import {
    AmoTime,
    ConvertPositionRequest,
    DhanEnv,
    DhanHqClient,
    ExchangeSegment, OrderDetail, OrderType,
    PositionType,
    ProductType,
    TransactionType, Validity
} from "dhanhq";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;
const client: DhanHqClient = new DhanHqClient({
    accessToken: ACCESS_TOKEN,
    env: DhanEnv.PROD
});

async function getHoldings() {
    try {
        const holdings = await client.getHoldings();
        console.log(holdings)
    } catch (exception) {
        console.log(exception)
    }
}

async function getFunds() {
    try {
        const fundLimit = await client.getFundLimit();
        console.log(fundLimit)
    } catch (exception) {
        console.log(exception)
    }
}

async function getPositions() {
    try {
        const positions = await client.getPositions();
        console.log(positions)
    } catch (exception) {
        console.log(exception)
    }
}

async function convertPosition() {
    try {
        const convertPositionRequest: ConvertPositionRequest = {
            dhanClientId: DHAN_CLIENT_ID,
            fromProductType: ProductType.CNC,
            exchangeSegment: ExchangeSegment.NSE_EQ,
            positionType: PositionType.LONG,
            securityId: "",
            tradingSymbol: "",
            convertQty: 1,
            toProductType: ProductType.CNC,
        }
        const response = await client.convertPosition(convertPositionRequest);
        console.log(response);
    } catch (exception) {
        console.log(exception)
    }
}

var orderId = "";
const SECURITY_ID = "1624"; // IOC - NSE_EQ, Refer scrip master for security Id

async function createOrder() {
    try {
        const orderDetails = {
            dhanClientId: DHAN_CLIENT_ID,
            transactionType: TransactionType.BUY,
            exchangeSegment: ExchangeSegment.NSE_EQ,
            productType: ProductType.INTRADAY,
            orderType: OrderType.LIMIT,
            validity: Validity.DAY,
            securityId: SECURITY_ID,
            quantity: 1,
            price: 70,
            afterMarketOrder: false,
            amoTime: AmoTime.OPEN
        }
        const response = await client.placeOrder(orderDetails as OrderDetail);
        console.log(response)
        orderId = response.orderId;
    } catch (exception) {
        console.log(exception)
    }
}

async function updateOrder(id: string) {
    try {
        const orderDetail: any = {
            orderId: id,
            orderType: OrderType.LIMIT,
            quantity: 1,
            price: 70.5,
            validity: Validity.DAY
        }
        const response = await client.modifyOrder(id, orderDetail);
        console.log(response)
    } catch (exception) {
        console.log(exception)
    }
}

async function getOrderByOrderId(id: string) {
    try {
        let orderDetail = await client.getOrderByOrderId(id);
        console.log(orderDetail)
    } catch (exception) {
        console.log(exception)
    }
}

async function cancelOrderByOrderId(id: string) {
    try {
        let orderDetail = await client.cancelOrderByOrderId(id);
        console.log(orderDetail)
    } catch (exception) {
        console.log(exception)
    }
}

async function getAllOrders() {
    try {
        const orders = await client.getAllOrders();
        console.log(orders)
    } catch (exception) {
        console.log(exception)
    }
}

async function demo() {
    console.log("***** GET HOLDINGS *****")
    await getHoldings();

    console.log("***** GET POSITIONS *****")
    await getPositions();

    console.log("***** GET FUNDS *****")
    await getFunds();

    console.log("***** CREATE ORDER *****")
    await createOrder();

    console.log("***** GET ORDER BY ID *****")
    await getOrderByOrderId(orderId);

    console.log("***** UPDATE ORDER BY ID *****")
    await updateOrder(orderId);

    console.log("***** DELETE ORDER BY ID *****")
    await cancelOrderByOrderId(orderId);

    console.log("***** GET ORDER BY ID *****")
    await getOrderByOrderId(orderId);

    console.log("***** GET ALL ORDERS *****")
    await getAllOrders();
}

demo();