const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const mode = process.argv[2]; // 'local' or 'docker'

if (!mode || !['local', 'docker'].includes(mode)) {
    console.error('Usage: node detect-platform.js [local|docker]');
    process.exit(1);
}

const scriptName = `start-${mode}`;
const scriptPath = isWindows
    ? path.join('scripts', `${scriptName}.bat`)
    : path.join('scripts', `${scriptName}.sh`);

console.log(`Detected platform: ${isWindows ? 'Windows' : 'Unix'}`);
console.log(`Running script: ${scriptPath}`);

const command = isWindows
    ? scriptPath
    : `./${scriptPath}`;

const child = spawn(command, [], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
});

child.on('error', (error) => {
    console.error(`Error running script: ${error.message}`);
    process.exit(1);
});

child.on('exit', (code) => {
    process.exit(code || 0);
});
