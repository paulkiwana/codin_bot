import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

try {
  console.log('[v0] Creating pull request...');
  
  // Configure git
  execSync('git config user.email "v0@vercel.com"', { cwd: projectRoot, stdio: 'pipe' });
  execSync('git config user.name "v0 Bot"', { cwd: projectRoot, stdio: 'pipe' });
  
  // Stage all changes
  console.log('[v0] Staging changes...');
  execSync('git add .', { cwd: projectRoot, stdio: 'pipe' });
  
  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { cwd: projectRoot }).toString();
  
  if (status.trim()) {
    // Commit changes
    console.log('[v0] Committing changes...');
    execSync('git commit -m "feat: Add static HTML/CSS/JS crypto monitor web app\n\n- Convert Next.js app to pure HTML/CSS/JavaScript\n- Works on Vercel and Render without build process\n- Includes PWA manifest for Chrome app installation\n- Real-time crypto monitoring with Binance API\n- Trading alerts and notifications"', { 
      cwd: projectRoot,
      stdio: 'pipe'
    });
    
    // Push to the head branch
    console.log('[v0] Pushing to v0/paulkiwana-4bef5f5f...');
    execSync('git push origin v0/paulkiwana-4bef5f5f', { cwd: projectRoot });
    
    console.log('\n✓ Changes pushed successfully!');
    console.log('\nTo create a pull request, visit:');
    console.log('https://github.com/paulkiwana/codin_bot/pull/new/v0/paulkiwana-4bef5f5f');
    console.log('\nOr use GitHub CLI: gh pr create --base main --head v0/paulkiwana-4bef5f5f');
  } else {
    console.log('[v0] No changes to commit');
  }
} catch (error) {
  console.error('[v0] Error:', error.message);
  process.exit(1);
}
