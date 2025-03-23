// fix-prettier.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Files with Prettier issues
const filesToFix = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/Animated-graded-background.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/dialog.tsx',
  'src/lib/utils.ts',
];

console.log('🔍 Starting Prettier fixes...');

try {
  // Run Prettier with --write flag to fix all files
  const command = `npx prettier --write ${filesToFix.join(' ')}`;
  console.log(`Running: ${command}`);

  execSync(command, { stdio: 'inherit' });

  console.log('✅ All files have been formatted successfully!');
  console.log('You can now run "npm run build" again.');
} catch (error) {
  console.error('❌ Error fixing formatting issues:', error.message);
  process.exit(1);
}
