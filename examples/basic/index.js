const { EasyOCR } = require('node-easyocr');

const ocr = new EasyOCR();

async function main() {
  try {
    // Initialize the OCR reader with desired languages
    await ocr.init(['en', 'fr']);
    console.log('OCR initialized successfully');

    const imagePaths = ['image1.png', 'image2.png'];

    console.time('Total OCR Process');
    
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      console.log(`\nProcessing image ${i + 1}: ${imagePath}`);
      
      console.time(`OCR Process for image ${i + 1}`);
      const result = await ocr.readText(imagePath);
      console.timeEnd(`OCR Process for image ${i + 1}`);

      console.log(`OCR Results for image ${i + 1}:`);
      result.forEach((item, lineIndex) => {
        console.log(`Line ${lineIndex + 1}:`);
        console.log(`  Text: ${item.text}`);
        console.log(`  Confidence: ${(item.confidence * 100).toFixed(2)}%`);
        console.log(`  Bounding Box: [${item.bbox.map(coord => coord.join(', ')).join('] [')}]`);
        console.log('---');
      });
    }

    console.timeEnd('Total OCR Process');

    // Close the OCR reader to free up resources
    await ocr.close();
    console.log('OCR reader closed');
  } catch (error) {
    console.error('OCR Error:', error.message);
  }
}

main();