# Procedural NFT Generator Tutorial Repo

## Description
Repo containing all tutorial files from "Procedurally generated NFTs: Being an artist as a developer" originally published on the Chainstack blog. Contains scripts, contracts, ABI, BIN, and JSON files needed to create a new wallet, check its balance, compile an NFT contract, and mint NFTs using custom procedurally generated metadata on the Ethereum network.

## Tutorial link
Find the full tutorial article available on the Chainstack blog:
https://chainstack.com/procedurally-generated-nfts/

## File list
* keys.js - Script to generate a wallet address and key pair
* balance.js - Script to check the balance of a wallet address
* PCHNFT.sol - Smartcontract supporting functions to mint NFTs with custom tokenURI
* PCHNFT_sol_PlaceholderHeroes.abi - ABI compiled from the NFT minter smartcontract
* PCHNFT_sol_PlaceholderHeroes.bin - BIN compiled from the NFT minter smartcontract
* node_modules_@openzeppelin*.* - ABI & BIN files compiled from the contract dependencies
* deploy.js - Script to deploy the NFT minter smartcontract from the ABI & BIN files
* testorius.json - JSON array containing metadata needed to mint the Testorius NFT (1/3)
* lorema.json - JSON array containing metadata needed to mint the Lorema NFT (2/3)
* sampli.json - JSON array containing metadata needed to mint the Sampli NFT (3/3)
* mint.js - Script to mint an NFT with the metadata from one of the JSON arrays
* .env - Dotenv file containing pre-formatted slots needed for key script variables
* generate.js - Script to generate, merge and mint 3 image layers with corresponding metadata

## Dependency list
* Node endpoint - Get one for free at: https://console.chainstack.com/user/account/create
* Web3.js - Collection of libraries for Web3 interaction: https://web3js.readthedocs.io/
* @openzeppelin/contracts - Smartcontract library: https://github.com/OpenZeppelin/openzeppelin-contracts
* Solc.js - Solidity compiler library installed globally: https://github.com/ethereum/solc-js
* Dotenv - Environment file library to process key variables: https://github.com/motdotla/dotenv OR https://github.com/dotenv-org/dotenv-vault
* random-words - Library that generates a set of random words with pre-set number: https://github.com/apostrophecms/random-words
* text-to-image - Library that renders text into image: https://github.com/goyalabhi1305/tess-based-text-from-image
* jdenticon - Library that generates a random icon based on text seed: https://github.com/dmester/jdenticon
* canvas - Library that allows image drawing based on code input: https://github.com/Automattic/node-canvas
* image-data-uri - Library that renders dataURI to image file: https://github.com/DiegoZoracKy/image-data-uri
* merge-images - Library that merges several image layers into one: https://github.com/lukechilds/merge-images
* axios - HTTP request parser to handle IPFS upload: https://github.com/axios/axios
* form-data - Metadata generator library for file metadata uploaded to IPFS: https://github.com/form-data/form-data
## End result
* Contract: https://goerli.etherscan.io/address/0x144F7CF4F42FCb67D43d2B107694FFe52386D544
* Testorius: https://goerli.etherscan.io/tx/0xb99e7c14cd012d6be9f1cd2de12fc4585f8c3e3a9b6b038d57987265d4d1da9a
* Lorema: https://goerli.etherscan.io/tx/0xc5522987694a2eb97d6acca6f05a6a8707800e44c5f77d0f0871fc211a82a0d6
* Sampli: https://goerli.etherscan.io/tx/0xf8db9208ebbc782ebaf5dbddcb1e372c02a5bf021489f855d4715527519fd6bc
* Procedural: https://goerli.etherscan.io/tx/0x105522122b5f9a279ebc99a301dd6a32ed7b7d7761595b75aa73b9fd659cef10