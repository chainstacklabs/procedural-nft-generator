# Generate Image

Generate images in browser and node.

## Installation and Usage

```
npm install --save generate-image
```

### In Browser

```js
import GenerateImage from 'generate-image';
```

or

```html
<script src="path/to/generate-image.min.js"></script>
```

1\. Automatic:

```html
<img src="" data-gi="w=300&h=150&c='Hello World'">

<script>
  document.addEventListener('load', () => {
    GenerateImage.auto('data-gi');
  });
</script>
```

2\. Programmatic:

```js
const target = document.getElementById('image-target');

const imageData = GenerateImage({
  w: 300,
  h: 150,
  t: 'diagonal',
  c: 'Hello World',
});
target.src = imageData;
```

### In Node

```js
const GenerateImage = require('generate-image');

const imageData = GenerateImage({
  w: 300,
  h: 150,
});
```

## API

### GenerateImage.auto(attr)

| argument | required | default | info |
|----------|----------|---------|------|
| attr     | -        | 'data-gi' | data attr that provide option string for `<img>` |

### GenerateImage(options, encode)

| argument | required | default | info |
|----------|----------|---------|------|
| options  | -        | -       | [options](#options) |
| encode   | -        | true    | return dataURI or pure xml |

### options

| argument | required | default | info |
|----------|----------|---------|------|
| w        | -        | 300     | width |
| h        | -        | 150     | height |
| bc       | -        | '#F2F2F6' | background color |
| fc       | -        | '#666'  | foreground color |
| t        | -        | ''      | texture: 'diagonal' |
| c        | -        | ''      | text content |

## SVG template

```xml
<svg
    version="1.1"
    baseProfile="full"
    width="{ w }"
    height="{ h }"
    viewBox="0 0 { w } { h }"
    xmlns="http://www.w3.org/2000/svg">
  <!-- background color -->
  <rect
      width="100%"
      height="100%" 
      fill="{ bc }" />

  <!-- texture: diagonal -->
  <line
      x1="0"
      y1="0"
      x2="{ w }"
      y2="{ h }"
      stroke="{ fc }"
      stroke-width="1"
      stroke-opacity="0.6" />
  <line
      x1="0"
      y1="{ h }"
      x2="{ w }"
      y2="0"
      stroke="{ fc }"
      stroke-width="1"
      stroke-opacity="0.6" />

  <!-- text content -->
  <text
      x="{ w / 2 }"
      y="{ h / 2 }"
      text-anchor="middle"
      fill="{ fc }">{ c }</text>
</svg>
```

### License

[MIT](./LICENSE)
