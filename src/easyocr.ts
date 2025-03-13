import { spawn, ChildProcess } from 'child_process';
import path from 'path';

interface OCRResult {
  bbox: number[][];
  text: string;
  confidence: number;
}

interface CommandResult {
  status: 'success' | 'error';
  message?: string;
  data?: OCRResult[];
}

export class EasyOCR {
  private pythonPath: string;
  private scriptPath: string;
  private pythonProcess: ChildProcess | null = null;

  constructor() {
    this.pythonPath = 'python3';
    this.scriptPath = path.join(__dirname, 'easyocr_script.py');
  }

  private async startPythonProcess(): Promise<void> {
    if (this.pythonProcess) return;

    this.pythonProcess = spawn(this.pythonPath, [this.scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
    });

    this.pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      this.pythonProcess = null;
    });
  }

  private async sendCommand(command: string, args: string[] = []): Promise<CommandResult> {
    await this.startPythonProcess();
    if (!this.pythonProcess) {
      throw new Error('Failed to start Python process');
    }

    return new Promise((resolve, reject) => {
      const commandString = `${command} ${args.join(' ')}\n`;
      this.pythonProcess!.stdin!.write(commandString);

      // adding this to collect partial JSON payloads, to support larger more complex image files than the data buffer response supports (JSON will be incomplete)
      let fullResult = '';
      
      const onData = (data: Buffer) => {
        const result = data.toString().trim();
        try {
          const parsedResult = JSON.parse(result);
          this.pythonProcess!.stdout!.removeListener('data', onData);
          resolve(parsedResult);
        } catch (error) {
          // handle commands for read_text of images differently if parsing fails
          if (command === 'read_text') {
            // add to the payload
            fullResult += result;
            try {
                // try parse again in case it's complete
                const parsedResult = JSON.parse(fullResult);
                // if it is complete, we can finish the process
                this.pythonProcess.stdout.removeListener('data', onData);
                resolve(parsedResult);
            }
            catch (error) {
              // it's incomplete, let's try again
              console.log("waiting for full result... ", fullResult);
            }
        } else {
            // all other errors go here
            reject(new Error(`Failed to parse Python output: ${error}`));
        }
        }
      };

      this.pythonProcess!.stdout!.on('data', onData);
    });
  }

  async init(languages: string[] = ['en']): Promise<void> {
    const result = await this.sendCommand('init', languages);
    if (result.status !== 'success') {
      throw new Error(result.message || 'Failed to initialize EasyOCR');
    }
  }

  async readText(imagePath: string): Promise<OCRResult[]> {
    const result = await this.sendCommand('read_text', [imagePath]);
    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to read text from image');
    }
  }

  async close(): Promise<void> {
    if (this.pythonProcess) {
      await this.sendCommand('close');
      this.pythonProcess.stdin!.end();
      await new Promise<void>((resolve) => {
        this.pythonProcess!.on('close', () => {
          this.pythonProcess = null;
          resolve();
        });
      });
    }
  }
}

export default EasyOCR;
