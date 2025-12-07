#!/usr/bin/env node

// Show the banner for user installations (skip for global installs)
const isGlobalInstall = process.env.npm_config_global;

if (!isGlobalInstall) {
  const version = require('../package.json').version;
  
  console.log('');
  console.log('┌─────────────────────────────────┐');
  console.log(`│  ⌚️  WristWatch v${version.padEnd(14)}│`);
  console.log('│  Lightweight date/time library  │');
  console.log('└─────────────────────────────────┘');
  console.log('');
}
