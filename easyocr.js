const { spawn } = require('child_process');
const path = require('path');

class EasyOCRWrapper {
  constructor() {
    this.pythonPath = 'python3';
    this.scriptPath = path.join(__dirname, 'easyocr_script.py');
  }

  async readText(imagePath, languages = ['en']) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
        this.scriptPath,
        imagePath,
        ...languages
      ]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${error.message}`));
          }
        }
      });
    });
  }
}

module.exports = EasyOCRWrapper;
