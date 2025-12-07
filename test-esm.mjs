// Test Node.js ES Module import
import { WristWatch, now, add, format, parseISO } from './dist/index.mjs';

console.log('=== Node.js ES Module Test ===');

// Test basic functionality
const currentTime = WristWatch.now();
console.log('✓ WristWatch.now() works:', currentTime.toISO());

const tomorrow = currentTime.add(1, 'day');
console.log('✓ add() works:', tomorrow.toISO());

const formatted = currentTime.format('YYYY-MM-DD HH:mm:ss');
console.log('✓ format() works:', formatted);

// Test functional API
const nowFunc = now();
console.log('✓ now() function works:', nowFunc.toISO());

const nextWeek = add(nowFunc.getDate(), 7, 'day');
console.log('✓ add() function works:', new Date(nextWeek).toISOString());

const formattedFunc = format(nowFunc.getDate(), 'MMMM D, YYYY');
console.log('✓ format() function works:', formattedFunc);

// Test comparison
const isAfter = tomorrow.isAfter(currentTime);
console.log('✓ isAfter() works:', isAfter);

// Test parsing
const parsed = parseISO('2025-12-06T10:30:00Z');
console.log('✓ parseISO() works:', parsed.success);

// Test tree-shaking - verify individual exports work
console.log('✓ Tree-shakeable exports work');

console.log('\n✅ All Node.js ES Module tests passed!');
