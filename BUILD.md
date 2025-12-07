# Build and Bundle Configuration

This document describes the build configuration and bundle optimization for WristWatch.

## Build System

WristWatch uses [tsup](https://tsup.egoist.dev/) as its build tool, which provides:

- Fast TypeScript compilation
- Automatic minification
- Tree-shaking support
- Source map generation
- Multiple output formats (CommonJS and ES Modules)

## Configuration

The build is configured in `tsup.config.ts`:

```typescript
{
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,              // Generate TypeScript declarations
  clean: true,            // Clean output directory before build
  minify: true,           // Minify output
  treeshake: true,        // Enable tree-shaking
  splitting: false,       // No code splitting for library
  sourcemap: true,        // Generate source maps
  target: 'es2020',       // Target ES2020
  outDir: 'dist'
}
```

## Build Scripts

### `npm run build`
Builds the library with minification and generates:
- `dist/index.js` - CommonJS bundle (minified)
- `dist/index.mjs` - ES Module bundle (minified)
- `dist/index.d.ts` - TypeScript declarations for CommonJS
- `dist/index.d.mts` - TypeScript declarations for ES Modules
- `dist/*.map` - Source maps for debugging

### `npm run build:analyze`
Builds with metafile generation for bundle analysis.

### `npm run verify:bundle`
Verifies that the build meets all requirements:
- Bundle size under 10KB (minified)
- Minification is enabled
- Source maps are generated
- TypeScript declarations are present
- Tree-shakeable exports are available

## Bundle Size

Current bundle sizes:
- **CommonJS**: ~8.3 KB (minified)
- **ES Module**: ~8.2 KB (minified)
- **TypeScript Definitions**: ~30 KB

All bundles are well under the 10KB requirement for the minified JavaScript.

## Tree-Shaking

The library is designed to support tree-shaking:

1. **Individual exports**: Each function is exported separately
2. **ES Module format**: Primary format supports tree-shaking
3. **No side effects**: Pure functions with no global side effects

Example of tree-shaking in action:

```typescript
// Only imports the `now` function
import { now } from 'wristwatch';

// Bundler will only include:
// - now() function
// - WristWatch class (dependency)
// - Required utilities
```

## Testing the Build

### Node.js Testing

Test CommonJS import:
```bash
npm run test:node
```

This runs:
- `test-node.js` - Tests CommonJS imports
- `test-esm.mjs` - Tests ES Module imports

### Browser Testing

Open `test-browser.html` in a browser to test:
- ES Module imports in browser
- All core functionality
- Visual test results

### Verification

Run the complete verification:
```bash
npm run verify:bundle
```

This checks:
- ✓ Bundle sizes are under limits
- ✓ Code is properly minified
- ✓ Source maps are generated
- ✓ TypeScript declarations exist
- ✓ Tree-shakeable exports are present

## Package Exports

The `package.json` is configured for optimal compatibility:

```json
{
  "main": "dist/index.js",           // CommonJS entry
  "module": "dist/index.mjs",        // ES Module entry
  "types": "dist/index.d.ts",        // TypeScript types
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",  // ES Module
      "require": "./dist/index.js"   // CommonJS
    }
  }
}
```

This ensures:
- Modern bundlers use ES Modules (better tree-shaking)
- Legacy tools use CommonJS
- TypeScript gets proper type definitions
- All environments are supported

## Environment Support

The library works in:

- **Node.js**: 14.0.0 and above
- **Browsers**: All modern browsers (ES2020 support)
- **Bundlers**: Webpack, Rollup, Vite, esbuild, etc.
- **TypeScript**: Full type support with inference

No polyfills required for modern environments.

## Pre-publish Checks

Before publishing, the following checks run automatically:

```bash
npm run prepublishOnly
```

This executes:
1. `npm run typecheck` - TypeScript type checking
2. `npm test` - Run all tests
3. `npm run build` - Build the library
4. `npm run verify:bundle` - Verify bundle requirements

All checks must pass before the package can be published.
