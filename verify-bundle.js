#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Bundle Size Verification ===\n');

const distDir = path.join(__dirname, 'dist');
const files = [
  { name: 'index.js', type: 'CommonJS', maxSize: 10 * 1024 },
  { name: 'index.mjs', type: 'ES Module', maxSize: 10 * 1024 },
  { name: 'index.d.ts', type: 'TypeScript Definitions', maxSize: 50 * 1024 }
];

let allPassed = true;

for (const file of files) {
  const filePath = path.join(distDir, file.name);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${file.name} (${file.type}): NOT FOUND`);
    allPassed = false;
    continue;
  }
  
  const stats = fs.statSync(filePath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  const passed = stats.size <= file.maxSize;
  
  const status = passed ? '✓' : '❌';
  const maxKB = (file.maxSize / 1024).toFixed(0);
  
  console.log(`${status} ${file.name} (${file.type}): ${sizeKB} KB / ${maxKB} KB max`);
  
  if (!passed) {
    allPassed = false;
  }
}

console.log('\n=== Feature Verification ===\n');

// Check for minification
const cjsContent = fs.readFileSync(path.join(distDir, 'index.js'), 'utf8');
const isMinified = !cjsContent.includes('\n\n') && cjsContent.length < 15000;
console.log(`${isMinified ? '✓' : '❌'} Code is minified`);

// Check for source maps
const hasSourceMaps = fs.existsSync(path.join(distDir, 'index.js.map')) &&
                      fs.existsSync(path.join(distDir, 'index.mjs.map'));
console.log(`${hasSourceMaps ? '✓' : '❌'} Source maps generated`);

// Check for TypeScript declarations
const hasDTS = fs.existsSync(path.join(distDir, 'index.d.ts')) &&
               fs.existsSync(path.join(distDir, 'index.d.mts'));
console.log(`${hasDTS ? '✓' : '❌'} TypeScript declarations generated`);

// Check for tree-shaking support (individual exports)
const hasExports = cjsContent.includes('exports.WristWatch') &&
                   cjsContent.includes('exports.now') &&
                   cjsContent.includes('exports.format');
console.log(`${hasExports ? '✓' : '❌'} Tree-shakeable exports present`);

console.log('\n=== Summary ===\n');

if (allPassed && isMinified && hasSourceMaps && hasDTS && hasExports) {
  console.log('✅ All bundle requirements met!');
  console.log('   - Bundle size under 10KB ✓');
  console.log('   - Minification enabled ✓');
  console.log('   - Source maps generated ✓');
  console.log('   - TypeScript declarations ✓');
  console.log('   - Tree-shaking support ✓');
  process.exit(0);
} else {
  console.log('❌ Some requirements not met');
  process.exit(1);
}
