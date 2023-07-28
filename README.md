# DhanHQ-js : v1.0

[![npm js](https://img.shields.io/npm/v/dhanhq.svg)](https://www.npmjs.com/package/dhanhq)

NodeJS client for communicating with the DhanHQ API.

DhanHQ-js library can be used to integrate with Trading and Data APIs faster. Execute orders in real time along with position management, historical data, tradebook and more with simple API collection.

Dhan (c) 2022. Licensed under the MIT License

## Documentation

- [DhanHQ API documentation](https://dhanhq.co/docs/v1/)
- [DhanHQ Developer Kit](https://api.dhan.co/)

## Requirements

- NodeJS v12.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/dhanhq)

    npm install dhanhq@latest

## Getting started with API

## JS

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

## TS

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
