import { spawn, ChildProcess } from 'child_process';
import path from 'path';

interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}

class EasyOCRWrapper {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    this.pythonPath = 'python3';
    this.scriptPath = path.join(__dirname, 'easyocr_script.py');
  }

  async readText(imagePath: string, languages: string[] = ['en']): Promise<OCRResult[]> {
    return new Promise((resolve, reject) => {
      const pythonProcess: ChildProcess = spawn(this.pythonPath, [
        this.scriptPath,
        imagePath,
        ...languages
      ]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout?.on('data', (data: Buffer) => {
        result += data.toString();
      });

      pythonProcess.stderr?.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code: number | null) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${(error as Error).message}`));
          }
        }
      });
    });
  }
}

export default EasyOCRWrapper;