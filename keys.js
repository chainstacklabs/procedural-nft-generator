var Web3 = require('web3');
require('dotenv').config();

var web3 = new Web3(Web3.givenProvider || process.env.ENDPOINT_URL);
var keys = web3.eth.accounts.create();
console.log(keys);