require('dotenv').config();
const endpoint = process.env.ENDPOINT_URL;
const address = process.env.PUBLIC_KEY;
const privKey = process.env.PRIVATE_KEY;
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || endpoint);
var fs = require('fs');
var contractABI = JSON.parse(fs.readFileSync('./PCHNFT_sol_PlaceholderHeroes.abi', 'utf8'));
var contractBIN = fs.readFileSync('./PCHNFT_sol_PlaceholderHeroes.bin', 'utf8');

//Create asynchronous deploy function
const deploy = async () => {
   console.log('Attempting to deploy contract from: ', address);
//Create new contract object
const contractNFT = new web3.eth.Contract(contractABI, address);
//Deploy contract object as a transaction
const contractTX = contractNFT.deploy({
      //Set transaction data as the contract bytecode
      data: contractBIN,
   });
//Sign the transaction
const createTransaction = await web3.eth.accounts.signTransaction(
      {
//Define transaction parameters
         from: address,
         data: contractTX.encodeABI(),
         gas: '2968862',
      },
      privKey
   );
//Return transaction receipt
const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
//Log contract address from receipt
   console.log('Contract successfully deployed at: ', createReceipt.contractAddress);
};

//Don’t forget to run the function!
deploy();
