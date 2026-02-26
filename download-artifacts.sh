#!/bin/bash

# Download and Deploy Artifacts from GitHub Actions
# Usage: ./download-artifacts.sh [run-id]

set -e

REPO_OWNER="himanshibansal-max"
REPO_NAME="shopizer-shop-reactjs"
ARTIFACT_NAME="deployment-package"
DEPLOY_DIR="./deployed-build"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     GitHub Actions Artifact Downloader & Deployer       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  macOS:   brew install gh"
    echo "  Linux:   See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo ""
    echo "Run: gh auth login"
    echo ""
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Get run ID
if [ -z "$1" ]; then
    echo "📋 Fetching latest successful workflow run..."
    RUN_ID=$(gh run list --repo "$REPO_OWNER/$REPO_NAME" --workflow=ci.yml --status=success --limit=1 --json databaseId --jq '.[0].databaseId')
    
    if [ -z "$RUN_ID" ]; then
        echo "❌ No successful workflow runs found."
        echo ""
        echo "Usage: $0 [run-id]"
        echo ""
        echo "To find run IDs:"
        echo "  gh run list --repo $REPO_OWNER/$REPO_NAME"
        exit 1
    fi
    
    echo "✅ Found latest run: $RUN_ID"
else
    RUN_ID=$1
    echo "📋 Using specified run ID: $RUN_ID"
fi

echo ""

# Download artifact
echo "⬇️  Downloading artifact: $ARTIFACT_NAME"
gh run download "$RUN_ID" --repo "$REPO_OWNER/$REPO_NAME" --name "$ARTIFACT_NAME"

if [ ! -f "shopizer-shop-build.tar.gz" ]; then
    echo "❌ Artifact download failed."
    exit 1
fi

echo "✅ Artifact downloaded: shopizer-shop-build.tar.gz"
echo ""

# Extract artifact
echo "📦 Extracting build..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
tar -xzf shopizer-shop-build.tar.gz -C "$DEPLOY_DIR"
rm shopizer-shop-build.tar.gz

echo "✅ Build extracted to: $DEPLOY_DIR"
echo ""

# Download build info
echo "📄 Downloading build info..."
gh run download "$RUN_ID" --repo "$REPO_OWNER/$REPO_NAME" --name "build-info" || echo "⚠️  Build info not available"

if [ -f "build-info.txt" ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                    Build Information                     ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    cat build-info.txt
    mv build-info.txt "$DEPLOY_DIR/"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   Deployment Ready                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Build location: $DEPLOY_DIR"
echo ""
echo "🚀 To serve locally:"
echo "   npx serve -s $DEPLOY_DIR -p 3000"
echo ""
echo "🐳 To deploy with Docker:"
echo "   docker run -v \$(pwd)/$DEPLOY_DIR:/usr/share/nginx/html:ro -p 80:80 nginx"
echo ""
