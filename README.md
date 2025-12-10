# WristWatch
[![npm version](https://img.shields.io/npm/v/@lukelowers/wrist-watch.svg)](https://www.npmjs.com/package/@lukelowers/wrist-watch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-wrist--watch-blue?logo=github)](https://github.com/lukelowers/wrist-watch)

A tiny date/time library that doesn't suck. JavaScript's `Date` was based on `java.util.Date` for backwards compatibility reasons and it shows. WristWatch wraps the native Date API with functions that are actually easy to remember and use.

Zero dependencies. Less than 10KB. Fully typed.


## Why?

Because `new Date().toISOString()` is annoying and `date.getMonth()` returning 0-11 is a footgun. WristWatch gives you:

- Functions that do what you expect
- Immutable operations (no accidental mutations)
- Proper month indexing (1-12, like a normal person)
- Format strings that make sense (with locale support)
- TypeScript support that actually helps
- Tree-shaking so you only ship what you use
- Simple date arithmetic and comparison functions
- Comprehensive test coverage with fast-check
- Easy conversion between timezones


## Installation

```bash
npm install @lukelowers/wrist-watch
```

```bash
yarn add @lukelowers/wrist-watch
```

```bash
pnpm add @lukelowers/wrist-watch
```

## Quick Start

```typescript
import { WristWatch, now } from '@lukelowers/wrist-watch';

// Get current time
const currentTime = now();

// Format dates
console.log(currentTime.format());
// Output: "2025-12-06 14:30:45" (default format)

console.log(currentTime.format('YYYY-MM-DD HH:mm:ss'));
// Output: "2025-12-06 14:30:45" (custom format)

console.log(currentTime.toRelative());
// Output: "just now"

// Date arithmetic
const tomorrow = currentTime.add(1, 'day');
const nextWeek = currentTime.add(1, 'week');

// Chain multiple operations
const future = currentTime.add(1, 'month').add(2, 'day').add(3, 'hour');

// Comparisons
if (tomorrow.isAfter(currentTime)) {
  console.log('Tomorrow is in the future!');
}
```

## Usage Guide

### Creating WristWatch Instances

```typescript
import { WristWatch, now, parse, parseISO } from '@lukelowers/wrist-watch';

// Current time
const currentTime = now();
const utcTime = now(true);
const tokyoTime = now('Asia/Tokyo');

// From Date object
const fromDate = new WristWatch(new Date('2025-12-05'));

// From timestamp (milliseconds)
const fromTimestamp = new WristWatch(1733396400000);

// From ISO string
const fromISO = new WristWatch('2025-12-05T10:30:00Z');

// Using parse function (with error handling)
const result = parse('2025-12-05T10:30:00Z');
if (result.success) {
  console.log(result.value.getYear()); // 2025
} else {
  console.error(result.error);
}
```

### Date Formatting

WristWatch supports flexible date formatting with custom patterns and locale-aware formatting.

#### Custom Format Patterns

```typescript
const date = now();

// Default format (no parameter needed)
date.format();                          // "2025-12-06 14:30:45"

// Basic formats
date.format('YYYY-MM-DD');              // "2025-12-06"
date.format('HH:mm:ss');                // "14:30:45"
date.format('YYYY-MM-DD HH:mm:ss');     // "2025-12-06 14:30:45"

// 12-hour time formats
date.format('h:mm A');                  // "2:30 PM"
date.format('hh:mm:ss a');              // "02:30:45 pm"
date.format('MM/DD/YYYY h:mm A');       // "12/06/2025 2:30 PM"

// Long formats with names
date.format('MMMM D, YYYY');            // "December 6, 2025"
date.format('dddd, MMM D [at] h:mm A'); // "Friday, Dec 6 at 2:30 PM"

// Custom separators
date.format('DD/MM/YYYY');              // "06/12/2025"
date.format('MM-DD-YY');                // "12-06-25"
```

**Supported Format Tokens:**

| Token | Description | Example |
|-------|-------------|---------|
| `YYYY` | 4-digit year | 2025 |
| `YY` | 2-digit year | 25 |
| `MMMM` | Full month name | December |
| `MMM` | Short month name | Dec |
| `MM` | 2-digit month | 12 |
| `M` | Month without leading zero | 12 |
| `DD` | 2-digit day | 06 |
| `D` | Day without leading zero | 6 |
| `dddd` | Full day name | Friday |
| `ddd` | Short day name | Fri |
| `HH` | 2-digit hour (24h) | 14 |
| `H` | Hour without leading zero (24h) | 14 |
| `hh` | 2-digit hour (12h) | 02 |
| `h` | Hour without leading zero (12h) | 2 |
| `mm` | 2-digit minute | 30 |
| `m` | Minute without leading zero | 30 |
| `ss` | 2-digit second | 45 |
| `s` | Second without leading zero | 45 |
| `SSS` | 3-digit millisecond | 123 |
| `A` | AM/PM uppercase | PM |
| `a` | am/pm lowercase | pm |

#### Locale-Aware Formatting

```typescript
const date = now();

// Short date formats
date.toShortDate();           // "12/6/2025" (US)
date.toShortDate('en-GB');    // "06/12/2025" (UK)
date.toShortDate('fr-FR');    // "06/12/2025" (France)
date.toShortDate('ja-JP');    // "2025/12/6" (Japan)

// Long date formats
date.toLongDate();            // "Friday, December 6, 2025"
date.toLongDate('fr-FR');     // "vendredi 6 décembre 2025"
date.toLongDate('es-ES');     // "viernes, 6 de diciembre de 2025"

// Custom locale formatting
date.formatWithLocale('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
// "Friday, December 6, 2025"
```

#### Relative Time

```typescript
const now = WristWatch.now();

// Past dates
const twoHoursAgo = now.subtract(2, 'hour');
twoHoursAgo.toRelative();     // "2 hours ago"

const yesterday = now.subtract(1, 'day');
yesterday.toRelative();       // "1 day ago"

// Future dates
const tomorrow = now.add(1, 'day');
tomorrow.toRelative();        // "in 1 day"

const nextWeek = now.add(1, 'week');
nextWeek.toRelative();        // "in 1 week"

// Very recent
const fiveSecondsAgo = now.subtract(5, 'second');
fiveSecondsAgo.toRelative();  // "just now"
```

### Date Arithmetic

All arithmetic operations return new WristWatch instances (immutable).

```typescript
const date = now();

// Adding time
const tomorrow = date.add(1, 'day');
const nextWeek = date.add(1, 'week');
const nextMonth = date.add(1, 'month');
const nextYear = date.add(1, 'year');
const in3Hours = date.add(3, 'hour');

// Subtracting time
const yesterday = date.subtract(1, 'day');
const lastWeek = date.subtract(1, 'week');
const lastMonth = date.subtract(1, 'month');
const lastYear = date.subtract(1, 'year');

// Calculating differences
const date1 = new WristWatch(new Date('2025-12-10'));
const date2 = new WristWatch(new Date('2025-12-05'));

date1.diff(date2);             // 5 (defaults to days)
date1.diff(date2, 'day');      // 5
date1.diff(date2, 'hour');     // 120
date1.diff(date2, 'week');     // 0.714...
date1.diff(date2, 'month');    // 0
```

**Supported Time Units:**
- `millisecond`
- `second`
- `minute`
- `hour`
- `day`
- `week`
- `month`
- `year`

### Date Comparison

All comparisons are timezone-independent (compare UTC timestamps).

```typescript
const date1 = new WristWatch(new Date('2025-12-05'));
const date2 = new WristWatch(new Date('2025-12-10'));
const date3 = new WristWatch(new Date('2025-12-05'));

// Equality
date1.equals(date3);          // true
date1.equals(date2);          // false

// Before/After
date1.isBefore(date2);        // true
date2.isAfter(date1);         // true

// Range checking (inclusive)
const date = new WristWatch(new Date('2025-12-07'));
const start = new WristWatch(new Date('2025-12-05'));
const end = new WristWatch(new Date('2025-12-10'));

date.isBetween(start, end);   // true
start.isBetween(start, end);  // true (inclusive)
end.isBetween(start, end);    // true (inclusive)
```

### Timezone Conversion

```typescript
const utc = new WristWatch('2025-12-05T12:00:00Z');

// Convert to specific timezones
const tokyo = utc.toTimezone('Asia/Tokyo');
const newYork = utc.toTimezone('America/New_York');
const london = utc.toTimezone('Europe/London');

// Convert to UTC
const local = now();
const utcTime = local.toUTC();

// Convert to local timezone
const utcDate = now(true);
const localTime = utcDate.toLocal();

// Invalid timezone returns null
const invalid = utc.toTimezone('Invalid/Timezone'); // null
if (invalid === null) {
  console.error('Invalid timezone');
}
```

### Parsing Dates

```typescript
import { parse, parseISO, parseTimestamp, parseCustom } from '@lukelowers/wrist-watch';

// General parse (tries multiple formats)
const result1 = parse('2025-12-05T10:30:00Z');
if (result1.success) {
  console.log(result1.value.getYear()); // 2025
} else {
  console.error(result1.error);
}

// Parse ISO 8601 strings
const result2 = parseISO('2025-12-05T10:30:00Z');

// Parse Unix timestamps (milliseconds)
const ww = parseTimestamp(1733396400000);

// Parse custom formats
const result3 = parseCustom('12/05/2025', 'MM/DD/YYYY');
if (result3.success) {
  console.log(result3.value.format('YYYY-MM-DD')); // "2025-12-05"
}

// Parse 12-hour time formats
const result4 = parseCustom('12/05/2025 2:30 PM', 'MM/DD/YYYY h:mm A');
const result5 = parseCustom('2025-12-05 02:30:45 pm', 'YYYY-MM-DD hh:mm:ss a');
```

### Accessing Date Components

```typescript
const date = new WristWatch('2025-12-06T14:30:45.123Z'); // Saturday, December 6

// Individual components (numbers)
date.getYear();        // 2025
date.getMonth();       // 12 (1-indexed, unlike native Date)
date.getDay();         // 6 (day of month)
date.getHours();       // 14
date.getMinutes();     // 30
date.getSeconds();     // 45

// Get month and day names
date.getMonth('long');   // "December"
date.getMonth('short');  // "Dec"
date.getDay('long');     // "Saturday" (day of week)
date.getDay('short');    // "Sat"

// Alternative: use format() for names
date.format('MMMM');     // "December"
date.format('MMM');      // "Dec"
date.format('dddd');     // "Saturday"
date.format('ddd');      // "Sat"

// All components at once
const components = date.getComponents();
// {
//   year: 2025,
//   month: 12,
//   day: 5,
//   hour: 14,
//   minute: 30,
//   second: 45,
//   millisecond: 123
// }

// Get underlying Date object
const nativeDate = date.getDate();

// Get Unix timestamp
const timestamp = date.getTimestamp(); // 1733408445123

// Get ISO string
const iso = date.toISO(); // "2025-12-05T14:30:45.123Z"
```

## Usage Patterns

### Object-Oriented Style

```typescript
import { WristWatch } from '@lukelowers/wrist-watch';

const ww = WristWatch.now();
const formatted = ww.format('YYYY-MM-DD');
const tomorrow = ww.add(1, 'day');
const isInFuture = tomorrow.isAfter(ww);
```

### Functional Style

```typescript
import { now, format, add, isAfter } from '@lukelowers/wrist-watch';

const date = now();
const formatted = format(date.getDate(), 'YYYY-MM-DD');
const tomorrow = add(date.getDate(), 1, 'day');
const isInFuture = isAfter(tomorrow, date.getDate());
```

## Two Ways to Use It

```typescript
// Method chaining
import { WristWatch } from '@lukelowers/wrist-watch';
const ww = WristWatch.now();
ww.add(1, 'day').format('YYYY-MM-DD');

// Functional
import { now, format, add } from '@lukelowers/wrist-watch';
const date = now();
format(add(date.getDate(), 1, 'day'), 'YYYY-MM-DD');
```

## TypeScript

Fully typed out of the box:

```typescript
import { TimeUnit, ParseResult } from '@lukelowers/wrist-watch';

const unit: TimeUnit = 'day';
const result: ParseResult<WristWatch> = parse('2025-12-05');

if (result.success) {
  console.log(result.value.getYear());
} else {
  console.error(result.error);
}
```

## API Reference

### WristWatch Class

#### Constructor
- `new WristWatch(input?: Date | number | string)` - Create a new WristWatch instance

#### Static Methods
- `WristWatch.now(timezoneOrUtc?: string | boolean)` - Get current time

#### Getters
- `getDate()` - Get underlying Date object
- `getTimestamp()` - Get Unix timestamp (milliseconds)
- `getYear()` - Get year
- `getMonth(format?: 'long' | 'short')` - Get month (1-12) or name
- `getDay(format?: 'long' | 'short')` - Get day of month (1-31) or day of week name
- `getHours()` - Get hours (0-23)
- `getMinutes()` - Get minutes (0-59)
- `getSeconds()` - Get seconds (0-59)
- `getComponents()` - Get all components

#### Formatting
- `format(pattern?: string)` - Format with custom pattern (defaults to 'YYYY-MM-DD HH:mm:ss')
- `toISO()` - Convert to ISO 8601 string
- `toShortDate(locale?: string)` - Short date format
- `toLongDate(locale?: string)` - Long date format
- `toRelative(referenceDate?: Date)` - Relative time description
- `formatWithLocale(locale: string, options?: Intl.DateTimeFormatOptions)` - Locale-specific formatting

#### Arithmetic
- `add(amount: number, unit: TimeUnit)` - Add time (chainable)
- `subtract(amount: number, unit: TimeUnit)` - Subtract time (chainable)
- `diff(other: WristWatch, unit?: TimeUnit)` - Calculate difference (defaults to 'day')

#### Comparison
- `equals(other: WristWatch)` - Check equality
- `isBefore(other: WristWatch)` - Check if before
- `isAfter(other: WristWatch)` - Check if after
- `isBetween(start: WristWatch, end: WristWatch)` - Check if in range

#### Timezone
- `toTimezone(timezone: string)` - Convert to timezone
- `toUTC()` - Convert to UTC
- `toLocal()` - Convert to local timezone

### Standalone Functions

#### Factory
- `now(timezoneOrUtc?: string | boolean)` - Get current time

#### Parsing
- `parse(input: string | number)` - Parse date string or timestamp
- `parseISO(input: string)` - Parse ISO 8601 string
- `parseTimestamp(input: number)` - Parse Unix timestamp
- `parseCustom(input: string, format: string)` - Parse custom format

#### Formatting
- `format(date: Date, pattern: string)` - Format date
- `toShortDate(date: Date, locale?: string)` - Short date format
- `toLongDate(date: Date, locale?: string)` - Long date format
- `toRelative(date: Date, referenceDate?: Date)` - Relative time
- `formatWithLocale(date: Date, locale: string, options?: Intl.DateTimeFormatOptions)` - Locale formatting

#### Arithmetic
- `add(date: Date, amount: number, unit: TimeUnit)` - Add time
- `subtract(date: Date, amount: number, unit: TimeUnit)` - Subtract time
- `diff(date1: Date, date2: Date, unit: TimeUnit)` - Calculate difference

#### Comparison
- `equals(date1: Date, date2: Date)` - Check equality
- `isBefore(date1: Date, date2: Date)` - Check if before
- `isAfter(date1: Date, date2: Date)` - Check if after
- `isBetween(date: Date, start: Date, end: Date)` - Check if in range

## Caveats

### Months are 1-indexed

Unlike native `Date.getMonth()` which returns 0-11, WristWatch returns 1-12:

```typescript
const date = new WristWatch('2025-12-05');
date.getMonth();              // 12 (December)
date.getDate().getMonth();    // 11 (native Date, 0-indexed)
```

### Adding months handles overflow

```typescript
const jan31 = new WristWatch('2025-01-31');
const feb = jan31.add(1, 'month');
feb.format('YYYY-MM-DD');     // "2025-02-28" (not March 3rd)

const mar31 = new WristWatch('2025-03-31');
const apr = mar31.add(1, 'month');
apr.format('YYYY-MM-DD');     // "2025-04-30" (April has 30 days)
```

### Timezone Handling

```typescript
const utc = new WristWatch('2025-12-05T12:00:00Z');
const tokyo = utc.toTimezone('Asia/Tokyo');

// Same moment in time
utc.getTimestamp() === tokyo.getTimestamp();  // true

// Different when formatted
utc.format('HH:mm');          // "12:00"
tokyo.format('HH:mm');        // "21:00" (UTC+9)
```

### String parsing can be weird

```typescript
// Inconsistent across browsers
const date1 = new WristWatch('12/05/2025');

// Reliable parsing
const result = parse('12/05/2025');
if (result.success) {
  const date2 = result.value;
}

// ISO format is always reliable
const date3 = new WristWatch('2025-12-05T10:30:00Z');
```

### Everything is immutable

```typescript
const date = now();
const tomorrow = date.add(1, 'day');

// date is unchanged
date.equals(tomorrow);        // false
```

### DST is handled for you

```typescript
// Fixed-duration units (hour, minute, second) use precise millisecond arithmetic
const date = new WristWatch('2025-03-09T01:00:00-05:00'); // Before DST
const plus24Hours = date.add(24, 'hour');
// Adds exactly 24 hours of elapsed time

// Calendar units (day, week) maintain wall-clock time
const plus1Day = date.add(1, 'day');
// Adds 1 calendar day, maintaining the same time of day
```

## Troubleshooting

### Invalid Timezone

If `toTimezone()` returns `null`, the timezone identifier is invalid:

```typescript
const date = now();
const result = date.toTimezone('Invalid/Timezone');

if (result === null) {
  console.error('Invalid timezone identifier');
  // Use a valid IANA timezone like 'America/New_York'
}
```

Use IANA timezone names like `America/New_York`, `Europe/London`, `Asia/Tokyo`.

### Check parse results

```typescript
const result = parse('invalid-date-string');

if (!result.success) {
  console.error('Parse failed:', result.error);
  // Handle the error appropriately
} else {
  // Safe to use result.value
  console.log(result.value.format('YYYY-MM-DD'));
}
```

### TypeScript Errors

If you encounter TypeScript errors, ensure you're using TypeScript 4.5 or later and that your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Tree-shaking

Import only what you need:

```typescript
// Specific
import { now, format, add } from '@lukelowers/wrist-watch';

// Imports everything
import * as wristwatch from '@lukelowers/wrist-watch';
```


## License
MIT © [lukelowers]


## Links

- [npm package](https://www.npmjs.com/package/@lukelowers/wrist-watch)
- [GitHub repository](https://github.com/lukelowers/wrist-watch)
- [Issue tracker](https://github.com/lukelowers/wrist-watch/issues)
