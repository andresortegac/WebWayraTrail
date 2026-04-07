const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
let shuttingDown = false;

function killProcess(child) {
  if (!child || child.killed) {
    return;
  }

  if (isWindows) {
    spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  killProcess(apiProcess);
  killProcess(webProcess);
  process.exit(exitCode);
}

const apiProcess = spawn(process.execPath, [path.join('server', 'server.js')], {
  cwd: rootDir,
  stdio: 'inherit',
});

const webProcess = isWindows
  ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm.cmd run dev:client'], {
      cwd: rootDir,
      stdio: 'inherit',
    })
  : spawn('npm', ['run', 'dev:client'], {
      cwd: rootDir,
      stdio: 'inherit',
    });

apiProcess.on('exit', (code) => {
  if (shuttingDown) {
    return;
  }

  console.error(`[api] termino con codigo ${code ?? 0}`);
  shutdown(code ?? 1);
});

webProcess.on('exit', (code) => {
  if (shuttingDown) {
    return;
  }

  console.error(`[web] termino con codigo ${code ?? 0}`);
  shutdown(code ?? 1);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
