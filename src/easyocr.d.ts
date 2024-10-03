import { ChildProcess } from 'child_process';

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

declare class EasyOCR {
  private pythonPath: string;
  private scriptPath: string;
  private pythonProcess: ChildProcess | null;

  constructor();

  private startPythonProcess(): Promise<void>;
  private sendCommand(command: string, args?: string[]): Promise<CommandResult>;

  init(languages?: string[]): Promise<void>;
  readText(imagePath: string): Promise<OCRResult[]>;
  close(): Promise<void>;
}

export { EasyOCR, OCRResult, CommandResult };
export default EasyOCR;