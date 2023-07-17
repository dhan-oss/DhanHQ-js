# DhanHQ-js

NodeJS client for communicating with the DhanHQ API.

## Documentation

- [DhanHQ API documentation](https://dhanhq.co/docs/v1/)

## Requirements

- NodeJS v12.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/dhanhq)

    npm install dhanhq@latest

## Getting started with API

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