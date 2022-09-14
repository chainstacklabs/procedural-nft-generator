require('dotenv').config();
const endpoint = process.env.ENDPOINT_URL;
const address = process.env.PUBLIC_KEY;
const privKey = process.env.PRIVATE_KEY;
const contractAdrs = process.env.CONTRACT_KEY;
var fs = require('fs');
var contractNFT = JSON.parse(fs.readFileSync('./PCHNFT_sol_PlaceholderHeroes.abi', 'utf8'));
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || endpoint);
var metadata = 'https://ipfs.io/ipfs/QmZZXrLMFFXYAcSQmjmtGNqc6ZhYe2ECCoANFAXVBS3T7y?filename=sampli.json';

const contractObj = new web3.eth.Contract(contractNFT, contractAdrs)
const startMint = async (tokenId) => {
     console.log('Attempting to mint to: ', address);
const mintTX = await web3.eth.accounts.signTransaction(
      {
         from: address,
         to: contractAdrs,
         data: contractObj.methods.safeMint(address, metadata).encodeABI(),
         //uri: metadata,
         gas: '2968862',
      },
      privKey
   );

const createReceipt = await web3.eth.sendSignedTransaction(
      mintTX.rawTransaction
   );
   console.log('NFT successfully minted with hash: ', createReceipt);
};
startMint(metadata);
