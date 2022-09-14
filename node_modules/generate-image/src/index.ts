interface GenerateImageOptions {
  /**
   * image width
   */
  w?: number,
  /**
   * image height
   */
  h?: number,
  /**
   * background color
   */
  bc?: string,
  /**
   * foreground color
   */
  fc?: string,
  /**
   * texture: 'diagonal'
   */
  t?: string,
  /**
   * text content
   */
  c?: string,
}

/**
 * Generate Image
 * @param options {GenerateImageOptions} generate options
 * @param encode {boolean} encode to dataURI or not
 */
const GenerateImage = (options?: GenerateImageOptions, encode?: boolean): any => {
  const _options = {
    w: 300,
    h: 150,
    bc: '#F2F2F6',
    fc: '#666',
    t: '',
    c: '',
  };

  if (options
      && options.w) {
    if (options.w <= 0) {
      throw(new Error(`options.w is invalid: ${ options.w }`));
    }
    _options.w = options.w;
  }

  if (options
      && options.h) {
    if (options.h <= 0) {
      throw(new Error(`options.h is invalid: ${ options.h }`));
    }
    _options.h = options.h;
  }

  if (options
      && options.bc) {
    _options.bc = options.bc;
  }

  if (options
      && options.fc) {
    _options.fc = options.fc;
  }

  if (options
      && options.t) {
    const textures = [
      'diagonal',
    ];

    if (textures.indexOf(options.t) < 0) {
      throw(new Error(`options.t is invalid: ${ options.t }`));
    }
    _options.t = options.t;
  }

  if (options
      && options.c) {
    _options.c = options.c;
  }

  /**
   * Generate SVG
   * @returns {string} dataURI or xml
   */
  const generate = (): string => {
    const bg = `<rect width="100%" height="100%" fill="${ _options.bc }" />`;

    let line1 = '';
    let line2 = '';
    if (_options.t === 'diagonal') {
        line1 = `<line x1="0" y1="0" x2="${ _options.w }" y2="${ _options.h }" stroke="${ _options.fc }" stroke-width="1" stroke-opacity="0.6" />`;
        line2 = `<line x1="0" y1="${ _options.h }" x2="${ _options.w }" y2="0" stroke="${ _options.fc }" stroke-width="1" stroke-opacity="0.6" />`;
    }

    let text = '';
    if (_options.c) {
      text = `<text x="${ _options.w / 2 }" y="${ _options.h / 2 }" text-anchor="middle" fill="${ _options.fc }">${ _options.c }</text>`;
    }

    const svg = `<svg version="1.1" baseProfile="full" width="${ _options.w }" height="${ _options.h }" viewBox="0 0 ${ _options.w } ${ _options.h }" xmlns="http://www.w3.org/2000/svg">${ bg }${ line1 }${ line2 }${ text }</svg>`;

    return encode === false
        ? svg
        : `data:image/svg+xml,${ encodeURIComponent(svg) }`;
  };

  return generate();
};

/**
 * Parse options string ("w=300&h=150&c='Hello World'") to GenerateImageOptions
 * @param value {string} options string
 * @returns {GenerateImageOptions} generate options
 */
GenerateImage.parseOptions = (value: string): GenerateImageOptions => {
  const options: any = {};
  console.log(value);
  const list = value.split('&');
  console.log(list);

  list.forEach((item) => {
    const attr = item.split('=');

    options[attr[0]] = (attr[0] === 'w'
      || attr[0] === 'h')
        ? parseInt(attr[1])
        : attr[1].replace(/['"]/g, '');
  });

  return options;
};

/**
 * Auto generate images for 'img[attr]'
 * @param attr {string} attribute name
 */
GenerateImage.auto = (attr?: string): void => {
  const attrName = attr
      || 'data-gi';

  const list = document.querySelectorAll(`img[${ attrName }`);
  list.forEach((item) => {
    let options = {};

    const value = item.getAttribute(attrName);
    if (value) {
      options = GenerateImage.parseOptions(value);
    }
    
    const imageData = GenerateImage(options);
    item.setAttribute('src', imageData);
  });
};

export default GenerateImage;
