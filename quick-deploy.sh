#!/bin/bash

# Quick Deploy Script - Download and Run Latest Build
# Usage: ./quick-deploy.sh [port]

PORT=${1:-3000}

echo "🚀 Quick Deploy - Latest Build"
echo ""

# Download artifacts
./download-artifacts.sh

# Check if serve is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Install Node.js first."
    exit 1
fi

echo "🌐 Starting server on port $PORT..."
echo ""
echo "   URL: http://localhost:$PORT"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

npx serve -s deployed-build -p "$PORT"
