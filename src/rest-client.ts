import {Base} from "./base";
import {Routes} from "./routes";
import {
    EdisTpinRequest, EdisTpinResponse,
    EdisStatusInquiryDetails, FundLimitDetails,
    DailyHistoricalDataRequest, HistoricalDataResponse,
    IntradayHistoricalDataRequest, HoldingsDetail,
    OrderDetail, OrderResponse, PositionDetail, ConvertPositionRequest
} from "./types";

export class RestClient extends Base {

    /**
     * Get T-Pin on your registered mobile number using this API.
     * @method generateTpin
     */
    generateTpin() {
        let endpoint = `/${Routes.EDIS}`;
        return this.request(endpoint);
    }

    /**
     * Retrieve escaped html form of CDSL and enter T-PIN to mark the stock for EDIS approval.
     * Partner has to render this form at their end to unescape. You can get ISIN of portfolio stocks,
     * in response of holdings API.
     * @method postEdisTpinForm
     * @param {EdisTpinRequest} tpinForm.
     */
    postEdisTpinForm(tpinForm: EdisTpinRequest): Promise<EdisTpinResponse> {
        let endpoint = `/${Routes.EDIS_FORM}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(tpinForm),
        });
    }

    /**
     * You can check the status of stock whether it is approved and marked for sell action.
     * User have to enter ISIN of the stock. An International Securities Identification Number (ISIN) is a 12-digit
     * alphanumeric code that uniquely identifies a specific security. You can get ISIN of portfolio stocks,
     * in response of holdings API.
     * @method getEdisStatusAndInquiry
     */
    getEdisStatusAndInquiry(): Promise<EdisStatusInquiryDetails> {
        let endpoint = `/${Routes.EDIS_INQUIRE_ISIN}`;
        return this.request(endpoint);
    }

    /**
     * Get all information of your trading account like balance, margin utilised, collateral, etc..
     * @method getFundLimit
     */
    getFundLimit(): Promise<FundLimitDetails> {
        let endpoint = `/${Routes.FUND_LIMIT}`;
        return this.request(endpoint);
    }

    /**
     * Retrieve OHLC & Volume of daily candle for desired instrument.
     * The data for any scrip is available back upto the date of its inception.
     * @method getDailyHistoricalData
     * @param {DailyHistoricalDataRequest} dailyHistoricalDataRequest.
     */
    getDailyHistoricalData(dailyHistoricalDataRequest: DailyHistoricalDataRequest): Promise<HistoricalDataResponse> {
        let endpoint = `/${Routes.HISTORICAL}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(dailyHistoricalDataRequest),
        });
    }

    /**
     * Retrieve OHLC & Volume of 1 minute candle for desired instrument for current day.
     * This data available for all segments including futures & options.
     * @method getIntradayHistoricalData
     * @param {IntradayHistoricalDataRequest} intradayHistoricalDataRequest.
     */
    getIntradayHistoricalData(intradayHistoricalDataRequest: IntradayHistoricalDataRequest): Promise<HistoricalDataResponse> {
        let endpoint = `/${Routes.HISTORICAL_INTRADAY}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(intradayHistoricalDataRequest),
        });
    }

    /**
     * The order request API lets you place new orders.
     * @method placeOrder
     * @param {OrderDetail} orderDetail.
     */
    placeOrder(orderDetail: OrderDetail): Promise<OrderResponse> {
        let endpoint = `/${Routes.ORDERS}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(orderDetail),
        });
    }

    /**
     * Using this API one can modify pending order in orderbook.
     * The variables that can be modified are price, quantity, order type & validity.
     * The user has to mention the desired value in fields.
     * @method modifyOrder
     * @param {String} orderId
     * @param {OrderDetail} orderDetail
     */
    modifyOrder(orderId: string, orderDetail: OrderDetail): Promise<OrderResponse> {
        let endpoint = `/${Routes.ORDERS}/${orderId}`;
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(orderDetail),
        });
    }

    /**
     * Users can cancel a pending order in the orderbook using the order id of an order.
     * There is no body for request and response for this call.
     * On successful completion of request ‘202 Accepted’ response status code will appear.
     * @method cancelOrderByOrderId
     * @param {String} orderId
     */
    cancelOrderByOrderId(orderId: string): Promise<OrderResponse> {
        let endpoint = `/${Routes.ORDERS}/${orderId}`;
        return this.request(endpoint, {
            method: "DELETE"
        });
    }

    /**
     * This API helps you slice your order request into multiple orders to allow you to
     * place over freeze limit quantity for F&O instruments.
     * @method placeSliceOrder
     * @param {OrderDetail} orderDetail
     */
    placeSliceOrder(orderDetail: OrderDetail): Promise<OrderResponse> {
        let endpoint = `/${Routes.ORDERS_SLICING}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(orderDetail),
        });
    }

    /**
     * This API lets you retrieve an array of all orders requested in a day with their last updated status.
     * @method getAllOrders
     */
    getAllOrders(): Promise<OrderDetail[]> {
        let endpoint = `/${Routes.ORDERS}`;
        return this.request(endpoint);
    }

    /**
     * Users can retrieve the details and status of an order from the orderbook placed during the day.
     * @method getOrderByOrderId
     * @param {String} orderId
     */
    getOrderByOrderId(orderId: string): Promise<OrderDetail> {
        let endpoint = `/${Routes.ORDERS}/${orderId}`;
        return this.request(endpoint);
    }

    /**
     * In case the user has missed order id due to unforeseen reason, this API retrieves
     * the order status using a tag called correlation id specified by users themselve.
     * @method getOrderByCorrelationId
     * @param {String} correlationId
     */
    getOrderByCorrelationId(correlationId: string): Promise<OrderDetail> {
        let endpoint = `/${Routes.ORDERS_BY_CORRELATION}/${correlationId}`;
        return this.request(endpoint);
    }

    /**
     * This API lets you retrieve an array of all trades executed in a day.
     * @method getTradeBook
     */
    getTradeBook(): Promise<OrderDetail[]> {
        let endpoint = `/${Routes.TRADE_BOOK}`;
        return this.request(endpoint);
    }

    /**
     * Users can retrieve the trade details using an order id. Often during partial trades or Bracket/ Cover Orders,
     * traders get confused in reading trade from tradebook.The response of this API will include all
     * the trades generated for a particular order id.
     * @method getTradesOfAnOrderByOrderId
     * @param {String} orderId
     */
    getTradesOfAnOrderByOrderId(orderId: string): Promise<OrderDetail> {
        let endpoint = `/${Routes.TRADE_BOOK}/${orderId}`;
        return this.request(endpoint);
    }

    /**
     * Users can retrieve all holdings bought/sold in previous trading sessions.
     * All T1 and delivered quantities can be fetched.
     * @method getHoldings
     */
    getHoldings(): Promise<HoldingsDetail[]> {
        let endpoint = `/${Routes.HOLDINGS}`;
        return this.request(endpoint);
    }

    /**
     * Users can retrieve a list of all open positions for the day.
     * This includes all F&O carryforward positions as well.
     * @method getPositions
     */
    getPositions(): Promise<PositionDetail[]> {
        let endpoint = `/${Routes.POSITIONS}`;
        return this.request(endpoint);
    }

    /**
     * Users can convert their open position from intraday to delivery or delivery to intraday.
     * @method convertPosition
     * @param {ConvertPositionRequest} convertPositionRequest
     */
    convertPosition(convertPositionRequest: ConvertPositionRequest): Promise<OrderResponse> {
        let endpoint = `/${Routes.POSITIONS_CONVERT}`;
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(convertPositionRequest),
        });
    }
}