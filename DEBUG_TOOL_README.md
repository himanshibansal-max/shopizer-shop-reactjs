# Frontend Error Debugging Tool

## Overview

This tool automatically captures browser errors, console logs, and failed network requests from your React application using Playwright. It's designed to help AI agents debug issues without manual copy-paste of console errors.

## Installation

```bash
# Install Playwright (one-time setup)
npm install --save-dev playwright

# Install Playwright browsers
npx playwright install chromium
```

## Usage

### 1. Start your React application
```bash
npm run dev
```

### 2. Run the debugging tool (in a separate terminal)
```bash
# Basic usage (defaults to http://localhost:3000)
node debug-tool.js

# Custom URL
node debug-tool.js http://localhost:3000

# Custom URL and output file
node debug-tool.js http://localhost:3000 my-errors.json
```

## What It Captures

### 1. Console Errors
- JavaScript errors logged to console
- Error messages and locations
- Timestamps

### 2. Page Errors (Uncaught Exceptions)
- Unhandled JavaScript exceptions
- Full stack traces
- Error messages

### 3. Network Errors
- Failed HTTP requests (status >= 400)
- Request/response details
- HTTP status codes
- Response bodies
- Request methods and headers

### 4. Visual Snapshot
- Full-page screenshot saved as PNG
- Helps visualize the error state

## Output Format

The tool generates a JSON file with the following structure:

```json
{
  "timestamp": "2026-02-26T14:33:29.749Z",
  "url": "http://localhost:3000",
  "consoleErrors": [
    {
      "type": "console",
      "level": "error",
      "message": "Error message here",
      "timestamp": "2026-02-26T14:33:30.123Z",
      "location": {
        "url": "http://localhost:3000/static/js/bundle.js",
        "lineNumber": 123,
        "columnNumber": 45
      }
    }
  ],
  "pageErrors": [
    {
      "type": "uncaught_exception",
      "message": "TypeError: Cannot read property 'x' of undefined",
      "stack": "Full stack trace...",
      "timestamp": "2026-02-26T14:33:31.456Z"
    }
  ],
  "networkErrors": [
    {
      "type": "network",
      "url": "http://localhost:8080/api/v1/products/group/FEATURED_ITEM_BROKEN",
      "method": "GET",
      "status": 404,
      "statusText": "Not Found",
      "headers": {},
      "responseBody": "Error response body",
      "timestamp": "2026-02-26T14:33:32.789Z"
    }
  ],
  "summary": {
    "totalErrors": 3,
    "consoleErrorCount": 1,
    "pageErrorCount": 1,
    "networkErrorCount": 1
  }
}
```

## How AI Agents Use This

### 1. Automated Error Detection
Instead of asking users to manually copy console errors, the AI agent can:
```
AI: "I'll check for errors in your application."
AI: [Runs: node debug-tool.js]
AI: [Reads: frontend-errors.json]
AI: "I found a 404 error on /api/v1/products/group/FEATURED_ITEM_BROKEN"
```

### 2. Root Cause Analysis
The AI can analyze:
- **Network errors**: Identify wrong API endpoints, missing routes
- **Console errors**: Find JavaScript bugs, undefined variables
- **Stack traces**: Pinpoint exact file and line number
- **Screenshots**: Verify visual state

### 3. Automated Fixes
With structured error data, the AI can:
1. Identify the error type
2. Locate the problematic file
3. Suggest or apply fixes
4. Re-run the tool to verify the fix

### Example AI Workflow
```
1. User: "My app isn't loading products"
2. AI: Runs debug-tool.js
3. AI: Reads frontend-errors.json
4. AI: Finds 404 on /api/v1/products/group/FEATURED_ITEM_BROKEN
5. AI: Searches codebase for "FEATURED_ITEM_BROKEN"
6. AI: Finds TabProduct.js line 32
7. AI: Fixes: FEATURED_ITEM_BROKEN → FEATURED_ITEM
8. AI: Re-runs debug-tool.js to verify fix
9. AI: "Fixed! The API endpoint was incorrect."
```

## Controlled Error Example

The current codebase has an intentional error for demonstration:

**File**: `src/wrappers/product/TabProduct.js`  
**Line**: ~32  
**Error**: API endpoint changed from `FEATURED_ITEM` to `FEATURED_ITEM_BROKEN`

This will cause a 404 network error that the tool will capture.

## Troubleshooting

### "Cannot find module 'playwright'"
```bash
npm install --save-dev playwright
```

### "Executable doesn't exist"
```bash
npx playwright install chromium
```

### "Connection refused"
Make sure your React app is running:
```bash
npm run dev
```

### "Timeout waiting for page"
Increase timeout in debug-tool.js:
```javascript
await page.goto(this.url, { 
  waitUntil: 'networkidle',
  timeout: 60000  // Increase to 60 seconds
});
```

## Advanced Usage

### Programmatic Usage
```javascript
const FrontendDebugger = require('./debug-tool');

const debugger = new FrontendDebugger('http://localhost:3000', 'errors.json');
const errors = await debugger.run();

if (errors.summary.totalErrors > 0) {
  console.log('Errors found:', errors);
  // Process errors programmatically
}
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
- name: Start app
  run: npm run dev &
  
- name: Wait for app
  run: sleep 10
  
- name: Check for errors
  run: node debug-tool.js
  
- name: Upload error report
  uses: actions/upload-artifact@v2
  with:
    name: error-report
    path: frontend-errors.json
```

## Files Generated

- `frontend-errors.json` - Structured error data
- `frontend-errors.png` - Screenshot of the page

## Cleanup

To remove the controlled error and restore normal functionality:

**File**: `src/wrappers/product/TabProduct.js`  
**Change**: 
```javascript
// FROM:
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM_BROKEN?store=' + ...

// TO:
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM?store=' + ...
```

Remove the comment line:
```javascript
// CONTROLLED ERROR: Intentionally calling non-existent endpoint for debugging demo
```

## Benefits for AI-Assisted Debugging

1. **No Manual Steps**: AI can run the tool automatically
2. **Structured Data**: JSON format is easy for AI to parse
3. **Complete Context**: Captures all error types in one run
4. **Reproducible**: Same command works every time
5. **Visual Verification**: Screenshot confirms the error state
6. **Fast Iteration**: Quick feedback loop for testing fixes

## License

MIT
