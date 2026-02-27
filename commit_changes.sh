#!/bin/bash

# Add all changes to git
git add -A

# Commit with a descriptive message
git commit -m "feat: build crypto monitor web app with PWA support

- Next.js 15 + React 19 full-stack app
- Dashboard with real-time crypto monitoring
- Alerts system with history tracking
- Settings page for symbol management
- PWA manifest and service worker support
- Installable as Chrome app on mobile and desktop
- Dark theme with Tailwind CSS styling
- Responsive design for all screen sizes"

# Show the commit status
git log -1 --oneline
