const { EasyOCR } = require('node-easyocr');

const ocr = new EasyOCR();

async function main() {
  try {
    const result = await ocr.readText('image.png', ['en', 'fr']);
    console.log('OCR Result:');
    result.forEach((item, index) => {
      console.log(`Line ${index + 1}: ${item.text}`);
    });
  } catch (error) {
    console.error('OCR Error:', error.message);
  }
}

main();