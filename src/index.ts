/**
 * WristWatch - A lightweight, zero-dependency date/time library
 * 
 * @packageDocumentation
 * 
 * WristWatch provides an intuitive API for common date and time operations,
 * wrapping JavaScript's native Date API with a more developer-friendly interface.
 * 
 * ## Features
 * 
 * - **Zero dependencies**: Uses only native JavaScript Date APIs
 * - **Small bundle size**: Less than 10KB minified
 * - **Immutable operations**: All operations return new instances
 * - **TypeScript support**: Full type definitions and inference
 * - **Tree-shakeable**: Import only what you need
 * - **Timezone support**: Easy conversion between timezones
 * - **Flexible formatting**: Custom format patterns and locale support
 * - **Date arithmetic**: Add, subtract, and calculate differences
 * - **Comparison operations**: Before, after, between, equals
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { WristWatch, now, format } from 'wristwatch';
 * 
 * // Get current time
 * const currentTime = now();
 * 
 * // Format dates
 * console.log(currentTime.format('YYYY-MM-DD HH:mm:ss'));
 * console.log(currentTime.toRelative()); // "just now"
 * 
 * // Date arithmetic
 * const tomorrow = currentTime.add(1, 'day');
 * const nextWeek = currentTime.add(1, 'week');
 * 
 * // Comparisons
 * if (tomorrow.isAfter(currentTime)) {
 *   console.log('Tomorrow is in the future!');
 * }
 * ```
 * 
 * ## Usage Patterns
 * 
 * ### Object-Oriented Style
 * ```typescript
 * const ww = WristWatch.now();
 * const formatted = ww.format('YYYY-MM-DD');
 * const tomorrow = ww.add(1, 'day');
 * ```
 * 
 * ### Functional Style
 * ```typescript
 * import { now, format, add } from 'wristwatch';
 * 
 * const date = now();
 * const formatted = format(date.getDate(), 'YYYY-MM-DD');
 * const tomorrow = add(date.getDate(), 1, 'day');
 * ```
 * 
 * @module wristwatch
 */

// Core class and types
export { WristWatch } from './core/WristWatch';
export type { TimeUnit, FormatPattern, ParseResult, DateComponents } from './core/types';

// Factory functions
export { now } from './factories/now';

// Parsing functions
export { parse, parseISO, parseTimestamp, parseCustom } from './parsers';

// Formatting functions
export { format, toShortDate, toLongDate, toRelative, formatWithLocale } from './operations/formatting';

// Arithmetic functions
export { add, subtract, diff } from './operations/arithmetic';

// Comparison functions
export { equals, isBefore, isAfter, isBetween } from './operations/comparison';
