# DhanHQ-js

NodeJS client for communicating with the DhanHQ API.

## Documentation

- [DhanHQ API documentation](https://dhanhq.co/docs/v1/)

## Requirements

- NodeJS v12.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/kiteconnect)

    npm install dhanhq@latest

Or via [yarn](https://yarnpkg.com/package/kiteconnect)

    yarn add dhanhq

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