import { execSync } from 'child_process';

console.log('[v0] Starting pull request finalization...');

try {
  // Change to project directory
  process.chdir('/vercel/share/v0-project');
  console.log('[v0] Working directory:', process.cwd());

  // Get current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  console.log('[v0] Current branch:', currentBranch);

  // Stage all changes
  console.log('[v0] Staging changes...');
  execSync('git add -A', { stdio: 'inherit' });

  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (status.trim() === '') {
    console.log('[v0] No changes to commit');
  } else {
    // Commit changes
    console.log('[v0] Committing changes...');
    execSync('git commit -m "feat: Add static HTML/CSS/JS crypto monitor web app\n\n- Convert Python/React Native app to standalone web app\n- Includes real-time crypto monitoring via Binance API\n- RSI and support/resistance level detection\n- Trading alerts with notifications\n- Mobile responsive dark theme UI\n- PWA support for Chrome app installation\n- Ready to deploy on Vercel or Render"', { stdio: 'inherit' });

    // Push to current branch
    console.log('[v0] Pushing changes to remote...');
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });

    console.log('[v0] Changes pushed successfully!');
    console.log('[v0] Branch:', currentBranch);
    console.log('[v0] Visit your repository to create a pull request to main');
  }
} catch (error) {
  console.error('[v0] Error:', error.message);
  process.exit(1);
}
