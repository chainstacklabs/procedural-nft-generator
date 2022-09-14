const GenerateImage = require('../dist');

const imageData = GenerateImage({
  w: 300,
  h: 150,
});

console.log(imageData);
