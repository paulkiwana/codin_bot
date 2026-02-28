import { execSync } from 'child_process';
import path from 'path';

const projectDir = path.resolve(process.cwd(), '..');

try {
  console.log('[v0] Changing to project directory...');
  process.chdir(projectDir);
  
  console.log('[v0] Current directory:', process.cwd());
  console.log('[v0] Checking git status...');
  
  // Check if we're in a git repo
  try {
    execSync('git status', { stdio: 'pipe' });
    console.log('[v0] Git repository found');
  } catch (e) {
    console.log('[v0] Initializing git repository...');
    execSync('git init');
    execSync('git config user.email "v0@vercel.com"');
    execSync('git config user.name "V0 Bot"');
    execSync('git branch -M main');
  }
  
  console.log('[v0] Adding all changes...');
  execSync('git add -A');
  
  console.log('[v0] Checking for changes to commit...');
  const status = execSync('git status --porcelain').toString();
  
  if (status.length > 0) {
    console.log('[v0] Committing changes...');
    execSync('git commit -m "feat: Convert Python/React Native app to static HTML/CSS/JS crypto monitor\n\n- Created standalone HTML/CSS/JavaScript web app\n- Binance API integration for real-time crypto data\n- RSI calculation and support/resistance detection\n- Trading alerts system with notifications\n- PWA support for Chrome app installation\n- Responsive mobile design\n- Works on Vercel and Render without build process"');
    
    console.log('[v0] Changes committed successfully');
    console.log('[v0] Git log:');
    console.log(execSync('git log -1 --oneline').toString());
  } else {
    console.log('[v0] No changes to commit');
  }
  
} catch (error) {
  console.error('[v0] Error:', error.message);
  console.error('[v0] Command output:', error.stdout?.toString() || '');
  process.exit(1);
}

console.log('[v0] Pull request setup complete!');
console.log('[v0] Changes are ready to be pushed to the repository.');
