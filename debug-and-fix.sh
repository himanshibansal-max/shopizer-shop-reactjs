#!/bin/bash

# Complete Debug & Fix Workflow
# This script demonstrates the full cycle: detect → fix → verify

echo "======================================"
echo "🤖 AI-Powered Debug & Fix Workflow"
echo "======================================"
echo ""

# Step 1: Detect errors
echo "Step 1: 🔍 Detecting errors..."
node debug-tool.js
echo ""

# Step 2: Check if errors exist
ERRORS=$(cat frontend-errors.json | grep -o '"totalErrors": [0-9]*' | grep -o '[0-9]*')

if [ "$ERRORS" -eq 0 ]; then
    echo "✨ No errors found! Application is healthy."
    exit 0
fi

echo "Found $ERRORS error(s)"
echo ""

# Step 3: Auto-fix
echo "Step 2: 🔧 Attempting auto-fix..."
node auto-fix.js
echo ""

# Step 4: Verify fix
echo "Step 3: ✅ Verifying fix..."
sleep 3  # Wait for app to rebuild
node debug-tool.js
echo ""

# Step 5: Compare results
NEW_ERRORS=$(cat frontend-errors.json | grep -o '"totalErrors": [0-9]*' | grep -o '[0-9]*')

echo "======================================"
echo "📊 Results"
echo "======================================"
echo "Before: $ERRORS errors"
echo "After:  $NEW_ERRORS errors"
echo ""

if [ "$NEW_ERRORS" -lt "$ERRORS" ]; then
    echo "🎉 Success! Reduced errors from $ERRORS to $NEW_ERRORS"
elif [ "$NEW_ERRORS" -eq 0 ]; then
    echo "✨ Perfect! All errors fixed!"
else
    echo "⚠️  Some errors require manual intervention"
fi

echo ""
echo "📁 Review: frontend-errors.json"
echo "🖼️  Screenshot: frontend-errors.png"
echo ""
