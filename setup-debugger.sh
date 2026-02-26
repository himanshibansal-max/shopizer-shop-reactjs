#!/bin/bash

# Frontend Debugger Setup Script
# This script installs Playwright and sets up the debugging tool

echo "🔧 Setting up Frontend Error Debugger..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install Playwright
echo "📦 Installing Playwright..."
npm install --save-dev playwright

if [ $? -eq 0 ]; then
    echo "✅ Playwright installed successfully"
else
    echo "❌ Failed to install Playwright"
    exit 1
fi

echo ""

# Install Chromium browser
echo "🌐 Installing Chromium browser..."
npx playwright install chromium

if [ $? -eq 0 ]; then
    echo "✅ Chromium installed successfully"
else
    echo "❌ Failed to install Chromium"
    exit 1
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📖 Usage:"
echo "   1. Start your React app: npm run dev"
echo "   2. Run the debugger: node debug-tool.js"
echo ""
echo "📚 For more information, see DEBUG_TOOL_README.md"
