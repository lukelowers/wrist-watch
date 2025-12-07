#!/usr/bin/env node

// Only show the banner if this is a user installation (not during development)
const isDevInstall = process.env.npm_config_global || 
                     process.env.npm_package_name === 'wrist-watch';

if (!isDevInstall) {
  const version = require('../package.json').version;
  
  console.log('');
  console.log('┌─────────────────────────────────┐');
  console.log(`│  ⌚️  WristWatch v${version.padEnd(14)}│`);
  console.log('│  Lightweight date/time library  │');
  console.log('└─────────────────────────────────┘');
  console.log('');
}
