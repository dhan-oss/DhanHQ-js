# DhanHQ-js : v1.0.3

[![npm js](https://img.shields.io/npm/v/dhanhq.svg)](https://www.npmjs.com/package/dhanhq)

NodeJS client for communicating with the DhanHQ API.

DhanHQ-js Rest API is used to automate investing and trading. Execute orders in real time along with position
management, historical data, tradebook and more with simple API collection.

Not just this, you also get real-time market data via DhanHQ Live Market Feed.

Dhan (c) 2022. Licensed under the MIT License

### Documentation

- [DhanHQ API documentation](https://dhanhq.co/docs/v1/)
- [DhanHQ Developer Kit](https://api.dhan.co/)

### v1.0.3 - What's New

Live Market Feed data is now available across exchanges and segments via DhanHQ

- Low latency websockets
- Unlimited instruments per socket
- Establish upto 5 sockets per user

With Market Feed, you can subscribe data in below formats:

- Ticker Data
- Quote Data
- Market Depth

## Features

* **Order Management**  
  The order management APIs lets you place a new order, cancel or modify the pending order, retrieve the order status,
  trade status, order book & tradebook.

* **Live Market Feed**  
  Get real-time market data to power your trading systems, with easy to implement functions and data across exchanges.

* **Portfolio**  
  With this set of APIs, retrieve your holdings and positions in your portfolio.

* **Historical Data**  
  Get historical candle data for the desired scrip across segments & exchange, both Intraday 1 minute OHLC and Daily
  OHLC.

* **Get fund limits**  
  Get all information of your trading account like balance, margin utilised, collateral, etc.

* **eDIS Authorisation**  
  To sell holding stocks, one needs to complete the CDSL eDIS flow, generate T-PIN & mark stock to complete the sell
  action.

## Requirements

- NodeJS v12.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/dhanhq)

    npm install dhanhq@latest

## Getting started with API

### JS

```javascript
var sdk = require("dhanhq");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

const client = new sdk.DhanHqClient({
    accessToken: ACCESS_TOKEN,
    env: "PROD"
});

function getHoldings() {
    client.getHoldings().then(response => {
        console.log(response);
    }, err => {
        console.log(err)
    })
}
```

### TS

```typescript
import {
    DhanEnv,
    DhanHqClient
} from "dhanhq";

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

```

### Market Feed Usage

```typescript
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

var instruments = [
  [NSE_FNO, '65378'],
  [MCX, '122843']
];
var subscriptionCode = Quote | Depth | Ticker;

const dhanFeed = new DhanFeed(DHAN_CLIENT_ID, ACCESS_TOKEN,
    instruments, subscriptionCode,
    onConnect, onMessage, onClose);

dhanFeed.connect();


const onConnect = async (instance: DhanFeed) => {
    await instance.subscribe(subscriptionCode, instruments);
};

const onMessage = async (instance: DhanFeed, message: any) => {
    console.log(message);
};

const onClose = async (instance: DhanFeed) => {
    console.log("Connection closed");
};

```