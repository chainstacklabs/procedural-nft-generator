//Process dependencies
require('dotenv').config();
const endpoint = process.env.ENDPOINT_URL;
const address = process.env.PUBLIC_KEY;
const privKey = process.env.PRIVATE_KEY;
const contractAdrs = process.env.CONTRACT_KEY;
const pinataJWT = process.env.PINATA_JWT
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || endpoint);
var fs = require('fs');
var randomWords = require('random-words');
var textToImage = require('text-to-image');
var jdenticon = require('jdenticon');
const { Canvas, Image } = require('canvas');
const ImageDataURI = require('image-data-uri');
var mergeImages = require('merge-images');
var axios = require('axios');
var FormData = require('form-data');
var data = new FormData();
var contractNFT = JSON.parse(fs.readFileSync('./PCHNFT_sol_PlaceholderHeroes.abi', 'utf8'));

// Initialize variables
var randomHex;
var randomStr;
var wordNrs;
var digiRoot;
var wordsOut = '';
var colorHex = '#';
var bgColorHex = '#';
var shapeSides = '';
var shapeSize = '';
var shapeCtrX = '';
var shapeCtrY = '';
var shapeStroke = '#';
var shapeFill = '#';
var idHex = '';
var ipfsPath;
var jsonPath;

const generator = async () => {
  // Random generator layer 0: Seed preparations
  console.log('\nSeed generation started...\n');

  // Generate random hex with 20 bytes for symbols (same as wallet addresses)
  randomHex = web3.utils.randomHex(20).concat(address.slice(2));
  console.log('Random hex generated: ' + randomHex + '\n');

  // Generate ids for filenames to organize easier
  idHex = randomHex.slice(2, 5).concat(randomHex.slice(79, 82))
  console.log('Used hex to generate ID: ' + idHex + '\n');

  // Generate random hex color value by picking random characters from the generated hex string
  for (var i = 0; i < 6; i++) {
    colorHex = colorHex.concat(randomHex.slice(2).charAt(Math.floor(Math.random() * randomHex.slice(2).length)));
    bgColorHex = bgColorHex.concat(randomHex.slice(2).charAt(Math.floor(Math.random() * randomHex.slice(2).length)));
  }
  console.log('Used hex to generate text color: ' + colorHex + ' & background color: ' + bgColorHex + '\n');

  // Generate new string by combining the random hex output with wallet address and converting it to number string
  wordNrs = web3.utils.hexToNumberString(randomHex);
  console.log('Transformed hex into number string: ' + wordNrs + '\n');

  // Begin calculations for random shape layer generation parameters

  // Randomize shape parameters but ensure they are never zero
  // Find out the number of sides the shape has by picking a random number from the number string above
      shapeSides = parseInt(1 + wordNrs.charAt(Math.floor(Math.random() * wordNrs.length)));
  console.log('Used number string to determine polygon shape sides count: ' + shapeSides + '\n');

  // Combine the first three digits of one of the two hex color values picked above with the last three of the other for greater variation

      shapeStroke = shapeStroke.concat(colorHex.slice(4, 7).concat(bgColorHex.slice(1, 4)));
      shapeFill = shapeFill.concat(bgColorHex.slice(4, 7).concat(colorHex.slice(1, 4)));
  console.log('Used text & background colors to generate new border: ' + shapeStroke + ' & fill: ' + shapeFill + '\n');

  // Loop following calculations twice to generate double or higher digit values to have the shape
  for (var i = 0; i < 2; i++) {

 // Avoid negative results by converting result to absolute value
 // Pick a random digit from the number string above, add the current shapeSize value, serve as float, multiply by Pi and add 10 for sizes between ~50 and ~150 for greater balance
      shapeSize = Math.abs(10 + Math.PI * parseFloat(shapeSize + parseInt(wordNrs.charAt(Math.floor(Math.random() * wordNrs.length)))));

// Same as above except you substract 100 instead of adding 10. This will make the shape roll around the middle
      shapeCtrX = Math.abs(Math.PI * parseFloat(shapeCtrX + parseInt(wordNrs.charAt(Math.floor(Math.random() * wordNrs.length)))) - 100);
      shapeCtrY = Math.abs(Math.PI * parseFloat(shapeCtrY + parseInt(wordNrs.charAt(Math.floor(Math.random() * wordNrs.length)))) - 100);
  }

  console.log('Used number string to determine polygon shape size: ' + shapeSize + ' X-axis center value: ' + shapeCtrX + ' & Y-axis center value: ' + shapeCtrY + '\n');


  //Reduce number string to single digit with the digital root formula
  function digitalRoot(input) {
      var nrStr = input.toString(),
          i,
          result = 0;

      if (nrStr.length === 1) {
          return +nrStr;
      }
      for (i = 0; i < nrStr.length; i++) {
          result += +nrStr[i];
      }
      return digitalRoot(result);
  }

  //Print digital root result
  digiRoot = digitalRoot(wordNrs);
  console.log('Calculated digital root of number string: ' + digiRoot + '\n');

  //Check if result is odd or even
  function NrChk(nr) {
     return nr % 2;
   }
  console.log('Checking if digital root is odd or even: ' + NrChk(digiRoot) + '\n');
  if (NrChk(digiRoot) > 0) {
  console.log('Generating 3 random words - digital root is odd\n');
  } else {
  console.log('Generating 2 random words - digital root is even\n');
  }
  // Random generator layer 1: Text

  //Generate set of random words - 2 for even 3 for odd. Since result will always be 0 or 1 easiest and fastest way is to just add 2. Replace "," with space for natural appeal
  randomStr = (randomWords(NrChk(digiRoot) + 2).toString()).split(',');
  console.log('Random words generated are: ' + randomStr + '\n');
  //Capitalize word set and join them as single string
  for (var i = 0; i < randomStr.length; i++) {
    randomStr[i] = (randomStr[i].charAt(0)).toUpperCase() + randomStr[i].slice(1);
  }
  wordsOut = randomStr.join(' ');
  console.log('Capitalizing random words string: ' + wordsOut + '\n');

  // Generate image from the random words, while using the library's debug mode to render to file
  // Exporting images to folders that do not exist yet may cause errors because of FS/OS permissions. Try creating them manually if you encounter such issue.
  var textPath = './texts/' + idHex + ' ' + wordsOut + ' ' + colorHex + ' [Text Layer].png';
  console.log('Exporting random words string as image to: ' + textPath + '\n');
  const dataUri = await textToImage.generate(idHex + ' ' + wordsOut, {
    debug: true,
    debugFilename: textPath,
    maxWidth: 330,
    customHeight: 33,
    fontSize: 18,
    fontFamily: 'Arial',
    lineHeight: 22,
    margin: 5,
    bgColor: bgColorHex,
    textColor: colorHex,
    textAlign: 'center',
    verticalAlign: 'top',
  });

  // Random generator layer 2: Icon

  // Set icon parameters
  var iconSize = 350;
  var iconSeed = wordsOut;
    // Export icon to png
  const iconExport = jdenticon.toPng(iconSeed, iconSize);
  var iconPath = './icons/' + idHex + ' ' + wordsOut + ' ' + colorHex + ' [Icon Layer].png';
  console.log('Using random words string as seed to generate icon at: ' + iconPath + '\n');
  fs.writeFileSync(iconPath, iconExport);


  // Random generator Layer 3: Shape

  // Create new canvas object and set the context to 2d
  const shapeCanvas = new Canvas (350, 350);
  const shapeContext = shapeCanvas.getContext('2d');

  // Start drawing path on canvas
  console.log('Using polygon settings to draw path points & paint shape...\n');
  shapeContext.beginPath();

  // Pick four incomprehensively generated points for the drawing path. Feel free to play around with the formula until you get desireable results
  shapeContext.moveTo (shapeCtrX + shapeSize * (Math.floor(Math.random() * 100 * Math.cos(shapeSides))), shapeCtrY +  shapeSize * (Math.floor(Math.random() * 10 * Math.sin(shapeSides * shapeSize))), shapeCtrX + shapeSize * (Math.floor(Math.random() * 1000 * Math.tan(shapeCtrY * shapeSides))), shapeCtrY + shapeSize * (Math.floor(Math.random() * (1 / Math.tan(shapeCtrX * shapeSides)))));

  // Connect the path points according to randomly picked number of sides for the polygon
  for (var i = 1; i <= shapeSides;i++) {
      shapeContext.lineTo (shapeCtrX + shapeSize * Math.cos(i * 2 * Math.PI / shapeSides), shapeCtrY + shapeSize * Math.sin(i * 2 * Math.PI / shapeSides));
  }

  // Close drawing path to complete the drawn object then proceed with applying border width and color, as well as fill color
  shapeContext.closePath();
  shapeContext.strokeStyle = shapeStroke;
  shapeContext.fillStyle = shapeFill;
  shapeContext.fill();
  shapeContext.lineWidth = shapeSides;
  shapeContext.stroke();

  // Record shape data URI to image buffer then render to preferred path
  const shapeBuffer = shapeCanvas.toBuffer("image/png");
  var shapePath = './shapes/' + shapeSides + ' ' + shapeStroke + '.png';
  console.log('Exporting polygon shape as image to: ' + shapePath + '\n');
  fs.writeFileSync(shapePath, shapeBuffer);


  // Merge existing layers by combining them in image buffer as data URI then output to file
  var mergePath = './merged/' + idHex + ' ' + wordsOut + ' ' + colorHex + ' [Merged].png';
  console.log('Merging all layers & exporting image to: ' + mergePath + '\n');
  mergeImages([shapePath, iconPath , textPath], {
    Canvas: Canvas,
    Image: Image
  }).then(function (response) {
    ImageDataURI.outputFile(response, mergePath)
  });

  // Wait for image generation to complete before pinning result on pinata

const addFile = async (source) => {
  console.log('Attempting to upload ' + source + ' via Pinata to IPFS...\n');
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const src = source;
  var status = 0;
  var data = new FormData();
  data.append('file', fs.createReadStream(src));

  //Set Pinata API access credentials and use it for the Axios configuration
    var config = {
      method: 'POST',
      url: url,
      headers: {
        "Content-Type": 'multipart/form-data; boundary=${data._boundary}',
        "Authorization": pinataJWT,
        ...data.getHeaders()
    },
  data: data
  };

  // Submit Axios request and wait for it to finish
  const response = await axios(config);
  console.log(response.data);

  // Get receipt for the image IPFS link from the Axios response
  ipfsPath = 'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash;
  console.log(source.slice(9) + ' successfully uploaded to: ' + ipfsPath + '\n');
  console.log('Allowing time for file propagation...\n');
  return ipfsPath;
        };
  setTimeout(() => {
  addFile(mergePath)
  }, 5000)

  // Create the metadata JSON after making sure the image is already uploaded
  setTimeout(() => {
  var dataObj = {
    name: '#' + idHex + ': ' + wordsOut,
    image: ipfsPath,
    description: 'A programmatically generated NFT with metadata seeds. Words: ' + wordsOut + ', Color: ' + colorHex + ', Digital Root: ' + digiRoot
  };

  // Convert the metadata JSON array into string so you can write it to file
  console.log('Attempting to create JSON metadata file...\n');
  var jsonObj = JSON.stringify(dataObj);
  fs.writeFile('./json/' + idHex + ' ' + wordsOut + ' ' + colorHex + '.json', jsonObj, 'utf8', function(err) {
    if (err) throw err;
    jsonPath = './json/' + idHex + ' ' + wordsOut + ' ' + colorHex + '.json';
  console.log('JSON metadata file created at: ' + jsonPath.slice(2) + '\n');

  // Upload the metadata JSON to IPFS after waiting for the file to be created
    setTimeout(() => {
    addFile(jsonPath);
  }, 10000)

  // Give ample time for the IPFS uploads to propagate or risk minting empty NFTs
        setTimeout(() => {
      startMint();
    }, 20000)
      });
  }, 10000)

  // Set the parameters of the minting transaction then sign it for processing
  const contractObj = new web3.eth.Contract(contractNFT, contractAdrs)
  const startMint = async (tokenId) => {
 console.log('Attempting to mint to address: ' + address + '\n');
  const mintTX = await web3.eth.accounts.signTransaction(
        {
           from: address,
           to: contractAdrs,
           data: contractObj.methods.safeMint(address, ipfsPath).encodeABI(),
           gas: '2968862',
        },
        privKey
     );

  // Ask for a receipt of your transaction
  const createReceipt = await web3.eth.sendSignedTransaction(
        mintTX.rawTransaction
     );
 console.log('NFT successfully minted. Here is your receipt: ', createReceipt);
 setTimeout(() => {
 console.log("\nThank you for using Petar's Procedural Minter!");
    }, 3000)
  };

};

// Don't forget to run the entire process!
generator();
