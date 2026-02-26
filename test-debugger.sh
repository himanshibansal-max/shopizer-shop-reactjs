#!/bin/bash

# Test the debugging tool
# This script demonstrates the complete workflow

echo "======================================"
echo "Frontend Debugging Tool - Demo"
echo "======================================"
echo ""

# Check if Playwright is installed
if ! npm list playwright &> /dev/null; then
    echo "⚠️  Playwright not installed. Running setup..."
    ./setup-debugger.sh
    echo ""
fi

# Check if React app is running
echo "🔍 Checking if React app is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ React app is running on http://localhost:3000"
else
    echo "❌ React app is not running!"
    echo ""
    echo "Please start the React app first:"
    echo "   npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "🚀 Running debugger..."
echo ""

# Run the debugger
node debug-tool.js

echo ""
echo "======================================"
echo "Demo Complete"
echo "======================================"
echo ""
echo "📁 Files generated:"
echo "   - frontend-errors.json (error data)"
echo "   - frontend-errors.png (screenshot)"
echo ""
echo "📖 View the error report:"
echo "   cat frontend-errors.json | jq"
echo ""
echo "🔧 To fix the error:"
echo "   Edit: src/wrappers/product/TabProduct.js"
echo "   Change: FEATURED_ITEM_BROKEN → FEATURED_ITEM"
echo ""
