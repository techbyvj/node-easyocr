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

Here's a basic example of how to use node-easyocr:

```javascript
const { default: EasyOCRWrapper } = require('node-easyocr');

const ocr = new EasyOCRWrapper();

async function main() {
  try {
    const result = await ocr.readText('path/to/your/image.png', ['en', 'fr']);
    console.log('OCR Result:');
    result.forEach((item, index) => {
      console.log(`Line ${index + 1}: ${item.text}`);
    });
  } catch (error) {
    console.error('OCR Error:', error.message);
  }
}

main();
```

## API

### `EasyOCRWrapper`

The main class for interacting with EasyOCR.

#### `readText(imagePath: string, languages: string[] = ['en']): Promise<OCRResult[]>`

Performs OCR on the specified image.

- `imagePath`: Path to the image file.
- `languages`: Array of language codes to use for OCR. Defaults to `['en']` (English).

Returns a Promise that resolves to an array of `OCRResult` objects:

```typescript
interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}
```

## Requirements

- Node.js 12.0.0 or higher
- Python 3.6 or higher
- pip (Python package installer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you find a bug or have a suggestion, please file an issue on the [GitHub repository](https://github.com/techbyvj/node-easyocr/issues).