import { execSync } from 'child_process';

try {
  console.log('Adding all changes to git...');
  execSync('git add -A', { stdio: 'inherit' });

  console.log('Committing changes...');
  execSync('git commit -m "feat: build crypto monitor web app with PWA support\n\n- Next.js 15 + React 19 full-stack app\n- Dashboard with real-time crypto monitoring\n- Alerts system with history tracking\n- Settings page for symbol management\n- PWA manifest and service worker support\n- Installable as Chrome app on mobile and desktop\n- Dark theme with Tailwind CSS styling\n- Responsive design for all screen sizes"', { stdio: 'inherit' });

  console.log('Showing commit...');
  execSync('git log -1 --oneline', { stdio: 'inherit' });

  console.log('\n✓ Changes committed successfully!');
} catch (error) {
  console.error('Error during commit:', error.message);
}
