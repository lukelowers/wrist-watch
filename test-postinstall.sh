#!/bin/bash

echo "=== Testing postinstall banner ==="
echo ""
echo "This is what users will see when they run 'npm install wrist-watch':"
echo ""

node scripts/postinstall.js

echo ""
echo "✅ Postinstall banner test complete!"
