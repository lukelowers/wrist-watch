# WristWatch ⌚

A lightweight, zero-dependency npm library for quick and convenient date/time operations. WristWatch provides an intuitive API that wraps JavaScript's native Date object with a more developer-friendly interface.

[![npm version](https://img.shields.io/npm/v/wrist-watch.svg)](https://www.npmjs.com/package/wrist-watch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Zero dependencies** - Uses only native JavaScript Date APIs
- **Small bundle size** - Less than 10KB minified
- **Immutable operations** - All operations return new instances
- **TypeScript support** - Full type definitions and inference
- **Tree-shakeable** - Import only what you need
- **Timezone support** - Easy conversion between timezones
- **Flexible formatting** - Custom format patterns and locale support
- **Date arithmetic** - Add, subtract, and calculate differences
- **Comparison operations** - Before, after, between, equals
- **Property-based tested** - Comprehensive test coverage with fast-check

## 📦 Installation

```bash
npm install wrist-watch
```

```bash
yarn add wrist-watch
```

```bash
pnpm add wrist-watch
```

## 🚀 Quick Start

```typescript
import { WristWatch, now } from 'wrist-watch';

// Get current time
const currentTime = now();

// Format dates
console.log(currentTime.format('YYYY-MM-DD HH:mm:ss'));
// Output: "2025-12-06 14:30:45"

console.log(currentTime.toRelative());
// Output: "just now"

// Date arithmetic
const tomorrow = currentTime.add(1, 'day');
const nextWeek = currentTime.add(1, 'week');

// Comparisons
if (tomorrow.isAfter(currentTime)) {
  console.log('Tomorrow is in the future!');
}
```

## 📖 Usage Guide

### Creating WristWatch Instances

```typescript
import { WristWatch, now, parse, parseISO } from 'wrist-watch';

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

// Basic formats
date.format('YYYY-MM-DD');              // "2025-12-06"
date.format('HH:mm:ss');                // "14:30:45"
date.format('YYYY-MM-DD HH:mm:ss');     // "2025-12-06 14:30:45"

// Long formats with names
date.format('MMMM D, YYYY');            // "December 6, 2025"
date.format('dddd, MMM D [at] HH:mm');  // "Friday, Dec 6 at 14:30"

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
| `H` | Hour without leading zero | 14 |
| `mm` | 2-digit minute | 30 |
| `m` | Minute without leading zero | 30 |
| `ss` | 2-digit second | 45 |
| `s` | Second without leading zero | 45 |
| `SSS` | 3-digit millisecond | 123 |

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
import { parse, parseISO, parseTimestamp, parseCustom } from 'wrist-watch';

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
```

### Accessing Date Components

```typescript
const date = new WristWatch('2025-12-05T14:30:45.123Z');

// Individual components
date.getYear();        // 2025
date.getMonth();       // 12 (1-indexed, unlike native Date)
date.getDay();         // 5
date.getHours();       // 14
date.getMinutes();     // 30
date.getSeconds();     // 45

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

## 🎨 Usage Patterns

### Object-Oriented Style

```typescript
import { WristWatch } from 'wrist-watch';

const ww = WristWatch.now();
const formatted = ww.format('YYYY-MM-DD');
const tomorrow = ww.add(1, 'day');
const isInFuture = tomorrow.isAfter(ww);
```

### Functional Style

```typescript
import { now, format, add, isAfter } from 'wrist-watch';

const date = now();
const formatted = format(date.getDate(), 'YYYY-MM-DD');
const tomorrow = add(date.getDate(), 1, 'day');
const isInFuture = isAfter(tomorrow, date.getDate());
```

## 📘 TypeScript Support

WristWatch is written in TypeScript and provides full type definitions.

```typescript
import { WristWatch, TimeUnit, ParseResult, DateComponents } from 'wrist-watch';

// Type-safe time units
const unit: TimeUnit = 'day';
const tomorrow = now().add(1, unit);

// Parse results with type guards
const result: ParseResult<WristWatch> = parse('2025-12-05');
if (result.success) {
  // TypeScript knows result.value is WristWatch
  console.log(result.value.getYear());
} else {
  // TypeScript knows result.error is string
  console.error(result.error);
}

// Date components interface
const components: DateComponents = now().getComponents();
console.log(components.year, components.month, components.day);
```

## 🔧 API Reference

### WristWatch Class

#### Constructor
- `new WristWatch(input?: Date | number | string)` - Create a new WristWatch instance

#### Static Methods
- `WristWatch.now(timezoneOrUtc?: string | boolean)` - Get current time

#### Getters
- `getDate()` - Get underlying Date object
- `getTimestamp()` - Get Unix timestamp (milliseconds)
- `getYear()` - Get year
- `getMonth()` - Get month (1-12)
- `getDay()` - Get day of month (1-31)
- `getHours()` - Get hours (0-23)
- `getMinutes()` - Get minutes (0-59)
- `getSeconds()` - Get seconds (0-59)
- `getComponents()` - Get all components

#### Formatting
- `format(pattern: string)` - Format with custom pattern
- `toISO()` - Convert to ISO 8601 string
- `toShortDate(locale?: string)` - Short date format
- `toLongDate(locale?: string)` - Long date format
- `toRelative(referenceDate?: Date)` - Relative time description
- `formatWithLocale(locale: string, options?: Intl.DateTimeFormatOptions)` - Locale-specific formatting

#### Arithmetic
- `add(amount: number, unit: TimeUnit)` - Add time
- `subtract(amount: number, unit: TimeUnit)` - Subtract time
- `diff(other: WristWatch, unit: TimeUnit)` - Calculate difference

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

## ⚠️ Important Caveats

### Month Indexing

Unlike JavaScript's native `Date.getMonth()` which returns 0-11, WristWatch's `getMonth()` returns 1-12 for better developer experience:

```typescript
const date = new WristWatch('2025-12-05');
date.getMonth();              // 12 (December)
date.getDate().getMonth();    // 11 (native Date, 0-indexed)
```

### Month Arithmetic

When adding or subtracting months, if the target day doesn't exist in the destination month, the date is adjusted to the last day of that month:

```typescript
const jan31 = new WristWatch('2025-01-31');
const feb = jan31.add(1, 'month');
feb.format('YYYY-MM-DD');     // "2025-02-28" (not March 3rd)

const mar31 = new WristWatch('2025-03-31');
const apr = mar31.add(1, 'month');
apr.format('YYYY-MM-DD');     // "2025-04-30" (April has 30 days)
```

### Timezone Handling

JavaScript Date objects store UTC timestamps internally. Timezone conversions primarily affect formatting, not the underlying timestamp:

```typescript
const utc = new WristWatch('2025-12-05T12:00:00Z');
const tokyo = utc.toTimezone('Asia/Tokyo');

// Same moment in time
utc.getTimestamp() === tokyo.getTimestamp();  // true

// Different when formatted
utc.format('HH:mm');          // "12:00"
tokyo.format('HH:mm');        // "21:00" (UTC+9)
```

### String Parsing

When using the constructor with a string, JavaScript's native Date parsing is used, which can be inconsistent across browsers for non-ISO formats. For reliable parsing, use the `parse()` or `parseISO()` functions:

```typescript
// ❌ Inconsistent across browsers
const date1 = new WristWatch('12/05/2025');

// ✅ Reliable parsing
const result = parse('12/05/2025');
if (result.success) {
  const date2 = result.value;
}

// ✅ ISO format is always reliable
const date3 = new WristWatch('2025-12-05T10:30:00Z');
```

### Immutability

All WristWatch operations return new instances. The original instance is never modified:

```typescript
const date = now();
const tomorrow = date.add(1, 'day');

// date is unchanged
date.equals(tomorrow);        // false
```

### DST Transitions

Daylight Saving Time transitions are handled automatically by JavaScript's native Date object. When adding days or hours across DST boundaries, the behavior depends on the time unit:

```typescript
// Fixed-duration units (hour, minute, second) use precise millisecond arithmetic
const date = new WristWatch('2025-03-09T01:00:00-05:00'); // Before DST
const plus24Hours = date.add(24, 'hour');
// Adds exactly 24 hours of elapsed time

// Calendar units (day, week) maintain wall-clock time
const plus1Day = date.add(1, 'day');
// Adds 1 calendar day, maintaining the same time of day
```

## 🐛 Troubleshooting

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

Valid timezone identifiers follow the IANA Time Zone Database format (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`). You can find a list at [IANA Time Zone Database](https://www.iana.org/time-zones).

### Parse Errors

Always check the `success` property when using parse functions:

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

### Bundle Size Issues

WristWatch supports tree-shaking. Import only what you need:

```typescript
// ❌ Imports everything
import * as wristwatch from 'wrist-watch';

// ✅ Tree-shakeable imports
import { now, format, add } from 'wrist-watch';
```

### Date Comparison Issues

If date comparisons aren't working as expected, ensure you're comparing WristWatch instances, not native Date objects:

```typescript
// ❌ Comparing Date objects
const date1 = now().getDate();
const date2 = now().getDate();
date1.equals(date2);  // Error: Date doesn't have equals()

// ✅ Comparing WristWatch instances
const ww1 = now();
const ww2 = now();
ww1.equals(ww2);      // Works correctly
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [itswiz]

## 🔗 Links

- [npm package](https://www.npmjs.com/package/wrist-watch)
- [GitHub repository](https://github.com/yourusername/wrist-watch)
- [Issue tracker](https://github.com/yourusername/wrist-watch/issues)

---

Made with ❤️ by developers, for developers.
