const { spawn, execSync } = require('child_process');
const path = require('path');

function getPythonPath() {
  try {
    // Try to get Python path using 'which' command (for Unix-like systems)
    const pythonPath = execSync('which python3 || which python').toString().trim();
    if (!pythonPath) {
      throw new Error('Python not found');
    }
    return pythonPath;
  } catch (error) {
    // If 'which' fails or returns empty, try 'where' command (for Windows)
    try {
      const pythonPath = execSync('where python').toString().split('\n')[0].trim();
      if (!pythonPath) {
        throw new Error('Python not found');
      }
      return pythonPath;
    } catch (windowsError) {
      throw new Error('Python not found. Please install Python and add it to your PATH.');
    }
  }
}

try {
  const pythonPath = getPythonPath();
  const venvPath = path.join(__dirname, 'venv');

  const requirements = [
    'easyocr',
    'torch',
    'torchvision'
  ];

  function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'inherit', ...options });
      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command failed with exit code ${code}`));
        } else {
          resolve();
        }
      });
    });
  }

  async function setup() {
    try {
      console.log('Setting up Python environment...');
      console.log(`Using Python at: ${pythonPath}`);
      
      // Create virtual environment
      console.log('Creating virtual environment...');
      await runCommand(pythonPath, ['-m', 'venv', venvPath]);
      
      // Determine the path to the virtual environment's Python executable
      const venvPythonPath = process.platform === 'win32'
        ? path.join(venvPath, 'Scripts', 'python.exe')
        : path.join(venvPath, 'bin', 'python');
      
      // Ensure pip is up to date in the virtual environment
      await runCommand(venvPythonPath, ['-m', 'pip', 'install', '--upgrade', 'pip']);
      
      // Install requirements in the virtual environment
      for (const req of requirements) {
        console.log(`Installing ${req}...`);
        await runCommand(venvPythonPath, ['-m', 'pip', 'install', req]);
      }
      
      console.log('Python environment setup complete!');
      console.log(`To activate the virtual environment, run:`);
      if (process.platform === 'win32') {
        console.log(`${path.join(venvPath, 'Scripts', 'activate.bat')}`);
      } else {
        console.log(`source ${path.join(venvPath, 'bin', 'activate')}`);
      }
    } catch (error) {
      console.error('Error setting up Python environment:', error);
      process.exit(1);
    }
  }

  setup();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}