import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('[v0] Starting crypto monitor dev server...');
console.log('[v0] Project root:', projectRoot);

// Start the Next.js dev server
const dev = spawn('npm', ['run', 'dev'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

dev.on('error', (error) => {
  console.error('[v0] Failed to start dev server:', error);
  process.exit(1);
});

dev.on('close', (code) => {
  console.log('[v0] Dev server stopped with code', code);
  process.exit(code);
});
