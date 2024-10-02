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

  const requirements = [
    'easyocr',
    'torch',
    'torchvision'
  ];

  function runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'inherit' });
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
      
      // Ensure pip is up to date
      await runCommand(pythonPath, ['-m', 'pip', 'install', '--upgrade', 'pip']);
      
      // Install requirements
      for (const req of requirements) {
        console.log(`Installing ${req}...`);
        await runCommand(pythonPath, ['-m', 'pip', 'install', req]);
      }
      
      console.log('Python environment setup complete!');
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