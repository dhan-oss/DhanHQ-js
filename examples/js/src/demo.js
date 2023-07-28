var dc = require("dhanhq");
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const DHAN_CLIENT_ID = process.env.DHAN_CLIENT_ID;

const client = new dc.DhanHqClient({
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

function getFunds() {
    client.getFundLimit().then(response => {
        console.log(response);
    }, err => {
        console.log(err)
    })
}

function getPositions() {
    client.getPositions().then(response => {
        console.log(response);
    }, err => {
        console.log(err)
    })
}
