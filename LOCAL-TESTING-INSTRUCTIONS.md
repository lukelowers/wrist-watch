# 📦 Local Testing Instructions for WristWatch

I've created a complete integration test project in the `test-project/` directory to verify that wrist-watch works correctly in real-world scenarios.

## 🎯 What's Been Set Up

The test project includes:

1. **ES Module Tests** (`test-esm.mjs`) - Tests ES6 import syntax
2. **CommonJS Tests** (`test-cjs.cjs`) - Tests require() syntax  
3. **Browser Tests** (`test-browser.html`) - Interactive browser testing with UI
4. **Tree-Shaking Tests** (`build-bundle.mjs`) - Verifies selective imports work
5. **Installation Verification** (`verify-installation.mjs`) - Quick health check

## 🚀 How to Test Locally

### Step 1: Build the Package
First, make sure the package is built:
```bash
npm run build
```

### Step 2: Link the Package
Use npm link to make wrist-watch available locally:
```bash
npm link
```

### Step 3: Navigate to Test Project
```bash
cd test-project
```

### Step 4: Link to the Package
```bash
npm link wrist-watch
```

### Step 5: Verify Installation
```bash
npm run verify
```

Expected output:
```
🔍 Verifying wrist-watch installation...

✅ wrist-watch found in node_modules
✅ dist/ directory found
✅ dist/index.js (CommonJS) found
✅ dist/index.mjs (ES Module) found
✅ dist/index.d.ts (TypeScript definitions) found

🧪 Testing imports...
✅ Successfully imported wrist-watch
✅ Basic functionality works: 2025-12-06 ...

==================================================
✅ Installation verification PASSED
```

### Step 6: Run Integration Tests

#### Test ES Modules:
```bash
npm run test:esm
```

#### Test CommonJS:
```bash
npm run test:cjs
```

#### Test Both at Once:
```bash
npm run test:all
```

#### Test in Browser:
```bash
npm run test:browser
```

This starts a local HTTP server. Then open http://localhost:3000/test-browser.html in your browser. You should see:
- All tests with green checkmarks (✓)
- "✅ All tests passed!" status
- No errors in the browser console

Press Ctrl+C to stop the server when done.

#### Test Tree-Shaking:
```bash
npm run build:bundle
```

## ✅ What Each Test Validates

### Node.js Tests (ESM & CJS)
- ✓ Package imports correctly
- ✓ WristWatch class works
- ✓ All date/time operations function
- ✓ Formatting works correctly
- ✓ Parsing handles valid and invalid input
- ✓ Arithmetic operations are accurate
- ✓ Comparisons work as expected
- ✓ Timezone conversions are correct

### Browser Test
- ✓ Works in browser environment
- ✓ ES modules load correctly
- ✓ All features work client-side
- ✓ Bundle size is reasonable
- ✓ No runtime errors

### Tree-Shaking Test
- ✓ Selective imports work
- ✓ Unused code can be eliminated
- ✓ Bundle size can be optimized

## 📋 Requirements Validated

This testing validates:
- **Requirement 6.3**: Tree-shaking support - verified by selective import tests
- **Requirement 6.4**: Works in Node.js and browsers - verified by all test suites

## 🔄 Alternative Installation Methods

If `npm link` doesn't work, try these alternatives:

### Method 2: Direct Install
From the test-project directory:
```bash
npm install ../
```

### Method 3: Using npm pack
From the wrist-watch root:
```bash
npm pack
```

Then from test-project:
```bash
npm install ../wrist-watch-1.0.0.tgz
```

## 📚 Documentation

- **Quick Start**: See `test-project/QUICK-START.md`
- **Full Details**: See `test-project/README.md`
- **Troubleshooting**: See README.md troubleshooting section

## ⏭️ Next Steps

After confirming all tests pass:
1. ✅ Package works correctly in local development
2. ✅ Both CommonJS and ES Modules are supported
3. ✅ Browser compatibility is confirmed
4. ✅ Tree-shaking works as expected
5. 🚀 Ready to proceed with npm publication (Task 15)

---

## 🤔 Please Confirm

**Please follow the steps above and let me know:**
1. Did the installation verification pass?
2. Did all Node.js tests (ESM and CJS) pass?
3. Did the browser test work correctly?
4. Are there any errors or issues?

Once you confirm everything works, we can proceed to the next task!
