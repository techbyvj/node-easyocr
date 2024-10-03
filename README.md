# node-easyocr

A Node.js wrapper for the Python EasyOCR library

## Description

node-easyocr is a Node.js wrapper for the popular Python EasyOCR library, allowing you to perform Optical Character Recognition (OCR) in your Node.js applications. This package provides a simple interface to use EasyOCR's functionality within your JavaScript/TypeScript projects.

## Installation

```bash
npm install node-easyocr
```

Note: This package requires Python 3.6+ and pip to be installed on your system. The necessary Python dependencies will be installed automatically during the npm installation process.

## Usage

node-easyocr supports both ES6 and CommonJS module systems. Here are examples for both:

### ES6 Usage

```javascript
import { EasyOCR } from 'node-easyocr';

const ocr = new EasyOCR();

async function main() {
  try {
    // Initialize the OCR reader with desired languages
    await ocr.init(['en', 'fr']);
    console.log('OCR initialized successfully');

    const imagePaths = ['path/to/image1.png', 'path/to/image2.png'];

    for (const imagePath of imagePaths) {
      console.log(`Processing image: ${imagePath}`);
      console.time('OCR Process');
      const result = await ocr.readText(imagePath);
      console.timeEnd('OCR Process');

      console.log('OCR Result:');
      result.forEach((item, index) => {
        console.log(`Line ${index + 1}:`);
        console.log(`  Text: ${item.text}`);
        console.log(`  Confidence: ${(item.confidence * 100).toFixed(2)}%`);
        console.log(`  Bounding Box: ${JSON.stringify(item.bbox)}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('OCR Error:', error.message);
  } finally {
    await ocr.close();
  }
}

main();
```

### CommonJS Usage

```javascript
const { EasyOCR } = require('node-easyocr');

const ocr = new EasyOCR();

async function main() {
  try {
    // Initialize the OCR reader with desired languages
    await ocr.init(['en', 'fr']);
    console.log('OCR initialized successfully');

    const imagePaths = ['path/to/image1.png', 'path/to/image2.png'];

    for (const imagePath of imagePaths) {
      console.log(`Processing image: ${imagePath}`);
      console.time('OCR Process');
      const result = await ocr.readText(imagePath);
      console.timeEnd('OCR Process');

      console.log('OCR Result:');
      result.forEach((item, index) => {
        console.log(`Line ${index + 1}:`);
        console.log(`  Text: ${item.text}`);
        console.log(`  Confidence: ${(item.confidence * 100).toFixed(2)}%`);
        console.log(`  Bounding Box: ${JSON.stringify(item.bbox)}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('OCR Error:', error.message);
  } finally {
    await ocr.close();
  }
}

main();
```

For more examples, please check the `examples/basic` directory in the project repository.

## API

### `EasyOCR`

The main class for interacting with EasyOCR.

#### `init(languages: string[] = ['en']): Promise<void>`

Initializes the OCR reader with the specified languages.

- `languages`: Array of language codes to use for OCR. Defaults to `['en']` (English).

#### `readText(imagePath: string): Promise<OCRResult[]>`

Performs OCR on the specified image.

- `imagePath`: Path to the image file.

Returns a Promise that resolves to an array of `OCRResult` objects:

```typescript
interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}
```

#### `close(): Promise<void>`

Closes the OCR reader and releases resources.

## Requirements

- Node.js 12.0.0 or higher
- Python 3.6 or higher
- pip (Python package installer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

You can reach out to the maintainer on X (Twitter): [@saidbyvj](https://x.com/saidbyvj)

## Issues

If you find a bug or have a suggestion, please file an issue on the [GitHub repository](https://github.com/techbyvj/node-easyocr/issues).