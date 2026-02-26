# GitHub Actions CI/CD Pipeline

## Overview

Automated CI/CD pipeline that builds, tests, and packages the React application on every push to main/develop branches.

## Pipeline Jobs

### 1. Test and Build
- Installs dependencies
- Runs linting (if available)
- Runs tests
- Builds production bundle
- Creates deployment package
- Uploads artifacts

### 2. Debug Check
- Runs automated error detection
- Uploads error reports
- Validates build quality

## Artifacts Generated

| Artifact | Description | Retention |
|----------|-------------|-----------|
| `build-{sha}` | Complete build directory | 30 days |
| `deployment-package` | Compressed build (tar.gz) | 30 days |
| `build-info` | Build metadata | 30 days |
| `error-report` | Debug tool results | 7 days |

## Usage

### View Workflow Runs
```bash
gh run list --repo himanshibansal-max/shopizer-shop-reactjs
```

### Download Latest Build
```bash
./download-artifacts.sh
```

### Download Specific Build
```bash
./download-artifacts.sh [run-id]
```

### Quick Deploy Locally
```bash
./quick-deploy.sh [port]
# Default port: 3000
```

## Manual Deployment

### Option 1: Using serve
```bash
./download-artifacts.sh
npx serve -s deployed-build -p 3000
```

### Option 2: Using Docker
```bash
./download-artifacts.sh
docker run -v $(pwd)/deployed-build:/usr/share/nginx/html:ro -p 80:80 nginx
```

### Option 3: Copy to server
```bash
./download-artifacts.sh
scp -r deployed-build/* user@server:/var/www/html/
```

## Prerequisites

### For CI Pipeline
- GitHub repository with Actions enabled
- Node.js 16.x
- npm with legacy peer deps support

### For Local Deployment
- GitHub CLI (`gh`) installed and authenticated
- Node.js and npm (for serve)
- Docker (optional, for containerized deployment)

## Installation

### Install GitHub CLI

**macOS:**
```bash
brew install gh
gh auth login
```

**Linux:**
```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
gh auth login
```

## Workflow Triggers

- **Push to main/develop**: Full CI pipeline
- **Pull Request to main**: Build and test validation
- **Manual**: Can be triggered via GitHub Actions UI

## Environment Variables

Set in GitHub repository settings (Settings → Secrets and variables → Actions):

```
# Optional: Custom build configuration
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

## Troubleshooting

### "No successful workflow runs found"
```bash
# Check recent runs
gh run list --repo himanshibansal-max/shopizer-shop-reactjs

# Trigger a new run by pushing a commit
git commit --allow-empty -m "Trigger CI"
git push
```

### "GitHub CLI not authenticated"
```bash
gh auth login
# Follow the prompts
```

### "Artifact download failed"
```bash
# Check if run completed successfully
gh run view [run-id] --repo himanshibansal-max/shopizer-shop-reactjs

# List available artifacts
gh run view [run-id] --repo himanshibansal-max/shopizer-shop-reactjs --log
```

## Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI/CD pipeline definition |
| `download-artifacts.sh` | Download and extract builds |
| `quick-deploy.sh` | One-command deploy |
| `CI_PIPELINE.md` | This documentation |

## Example Workflow

```bash
# 1. Make changes and push
git add .
git commit -m "Update feature"
git push

# 2. Wait for CI to complete (check GitHub Actions tab)

# 3. Download and deploy latest build
./quick-deploy.sh

# 4. Access at http://localhost:3000
```

## CI Pipeline Status

Check status badge (add to README.md):
```markdown
![CI Pipeline](https://github.com/himanshibansal-max/shopizer-shop-reactjs/actions/workflows/ci.yml/badge.svg)
```

## Advanced Usage

### Download Multiple Artifacts
```bash
# Download all artifacts from a run
gh run download [run-id] --repo himanshibansal-max/shopizer-shop-reactjs
```

### View Build Logs
```bash
gh run view [run-id] --repo himanshibansal-max/shopizer-shop-reactjs --log
```

### Re-run Failed Build
```bash
gh run rerun [run-id] --repo himanshibansal-max/shopizer-shop-reactjs
```

## Integration with Deployment

### Deploy to Production Server
```bash
#!/bin/bash
# deploy-to-prod.sh

./download-artifacts.sh
rsync -avz --delete deployed-build/ user@prod-server:/var/www/shopizer/
ssh user@prod-server "sudo systemctl reload nginx"
```

### Deploy to AWS S3
```bash
#!/bin/bash
# deploy-to-s3.sh

./download-artifacts.sh
aws s3 sync deployed-build/ s3://your-bucket-name/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Success Criteria

✅ Build completes without errors  
✅ Artifacts are uploaded  
✅ Build info is generated  
✅ Debug check passes  
✅ Deployment package is created  

## Support

For issues with:
- **CI Pipeline**: Check GitHub Actions logs
- **Artifact Download**: Verify GitHub CLI authentication
- **Local Deployment**: Check Node.js and port availability
