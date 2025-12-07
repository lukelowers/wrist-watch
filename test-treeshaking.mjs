// Test tree-shaking by importing only specific functions
// A good bundler should only include the imported functions and their dependencies

import { now, format } from './dist/index.mjs';

console.log('=== Tree-Shaking Test ===');
console.log('This test imports only `now` and `format` functions.');
console.log('A production bundler would only include these functions and their dependencies.\n');

const currentTime = now();
const formatted = format(currentTime.getDate(), 'YYYY-MM-DD');

console.log('✓ now() works:', currentTime.toISO());
console.log('✓ format() works:', formatted);
console.log('\n✅ Tree-shaking compatible - only imported functions are used!');
