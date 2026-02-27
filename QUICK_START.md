# Frontend Debugging Tool - Quick Start

## What Was Done

### 1. Introduced Controlled Error ✅

**File Modified:** `src/wrappers/product/TabProduct.js`

**Change Made:**
```javascript
// Line ~32 - Changed API endpoint to non-existent URL
// BEFORE:
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM?store=' + ...

// AFTER:
// CONTROLLED ERROR: Intentionally calling non-existent endpoint for debugging demo
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM_BROKEN?store=' + ...
```

**Error Type:** 404 Network Error

**Where It Appears:**
- ❌ Browser Console: "Error: Request failed with status code 404"
- 🌐 Network Tab: GET request to `/api/v1/products/group/FEATURED_ITEM_BROKEN` returns 404
- 👁️ Visible UI: Products don't load on home page (loading spinner continues)

**Impact:** Non-breaking - app still loads, but products section is empty

---

### 2. Created Playwright Debugging Tool ✅

**File Created:** `debug-tool.js`

**Features:**
- Captures console errors
- Captures uncaught exceptions
- Captures failed network requests (status >= 400)
- Takes full-page screenshot
- Outputs structured JSON
- Provides summary statistics

**Output Files:**
- `frontend-errors.json` - Structured error data
- `frontend-errors.png` - Screenshot

---

## Quick Start

### Installation (One-Time Setup)

```bash
# Option 1: Use setup script
./setup-debugger.sh

# Option 2: Manual installation
npm install --save-dev playwright
npx playwright install chromium
```

### Usage

```bash
# Terminal 1: Start React app
npm run dev

# Terminal 2: Run debugger (wait for app to load first)
node debug-tool.js
```

### Expected Output

```
🔍 Starting Frontend Debugger...
📍 Target URL: http://localhost:3000
📝 Output file: frontend-errors.json

🚀 Navigating to http://localhost:3000...
❌ Console Error: Error: Request failed with status code 404
🌐 Network Error: 404 - http://localhost:8080/api/v1/products/group/FEATURED_ITEM_BROKEN?store=DEFAULT&lang=en
⏳ Waiting for errors to surface (5 seconds)...
📸 Screenshot saved: frontend-errors.png

✅ Debug report saved to: frontend-errors.json

📊 Summary:
   Total Errors: 2
   Console Errors: 1
   Page Errors: 0
   Network Errors: 1

🔧 Errors detected. Review frontend-errors.json for details.

🏁 Debugger finished.
```

---

## Example JSON Output

```json
{
  "timestamp": "2026-02-26T14:33:29.749Z",
  "url": "http://localhost:3000",
  "consoleErrors": [
    {
      "type": "console",
      "level": "error",
      "message": "Error: Request failed with status code 404",
      "timestamp": "2026-02-26T14:33:32.123Z",
      "location": {
        "url": "http://localhost:3000/static/js/bundle.js",
        "lineNumber": 45678,
        "columnNumber": 23
      }
    }
  ],
  "pageErrors": [],
  "networkErrors": [
    {
      "type": "network",
      "url": "http://localhost:8080/api/v1/products/group/FEATURED_ITEM_BROKEN?store=DEFAULT&lang=en",
      "method": "GET",
      "status": 404,
      "statusText": "Not Found",
      "headers": {
        "content-type": "application/json"
      },
      "responseBody": "{\"timestamp\":\"2026-02-26T09:03:32.789+00:00\",\"status\":404,\"error\":\"Not Found\",\"path\":\"/api/v1/products/group/FEATURED_ITEM_BROKEN\"}",
      "timestamp": "2026-02-26T14:33:32.789Z"
    }
  ],
  "summary": {
    "totalErrors": 2,
    "consoleErrorCount": 1,
    "pageErrorCount": 0,
    "networkErrorCount": 1
  }
}
```

---

## How AI Agents Use This

### Automated Debugging Workflow

```
1. User: "Products aren't loading"

2. AI Agent:
   - Runs: node debug-tool.js
   - Reads: frontend-errors.json
   
3. AI Analysis:
   - Found: 404 error on /api/v1/products/group/FEATURED_ITEM_BROKEN
   - Searches: grep -r "FEATURED_ITEM_BROKEN" src/
   - Locates: src/wrappers/product/TabProduct.js:32
   
4. AI Fix:
   - Changes: FEATURED_ITEM_BROKEN → FEATURED_ITEM
   - Removes: Comment about controlled error
   
5. AI Verification:
   - Re-runs: node debug-tool.js
   - Confirms: summary.totalErrors === 0
   
6. AI Response:
   "✅ Fixed! The API endpoint had a typo. Products now load correctly."
```

### Key Benefits

1. **No Manual Copy-Paste**: AI gets errors automatically
2. **Structured Data**: JSON is easy for AI to parse
3. **Complete Context**: All error types in one file
4. **Visual Proof**: Screenshot shows the error state
5. **Fast Iteration**: Quick feedback loop for fixes

---

## Fixing the Controlled Error

To restore normal functionality:

**File:** `src/wrappers/product/TabProduct.js`

**Change Line ~32:**
```javascript
// Remove this line:
// CONTROLLED ERROR: Intentionally calling non-existent endpoint for debugging demo

// Change this:
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM_BROKEN?store=' + defaultStore + '&lang=' + currentLanguageCode;

// To this:
let action = constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM?store=' + defaultStore + '&lang=' + currentLanguageCode;
```

**Verify Fix:**
```bash
node debug-tool.js
# Should show: Total Errors: 0
```

---

## Files Created

| File | Purpose |
|------|---------|
| `debug-tool.js` | Main Playwright debugging script |
| `DEBUG_TOOL_README.md` | Detailed documentation |
| `AI_DEBUGGING_GUIDE.md` | Guide for AI agents |
| `QUICK_START.md` | This file - quick reference |
| `setup-debugger.sh` | Installation script |
| `example-output.json` | Example error output |

---

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
```bash
# Make sure React app is running
npm run dev
```

### No errors detected but products still not loading
```bash
# Check if backend is running
curl http://localhost:8080/api/v1/

# Check backend logs for errors
```

---

## Advanced Usage

### Custom URL
```bash
node debug-tool.js http://localhost:3001
```

### Custom Output File
```bash
node debug-tool.js http://localhost:3000 my-errors.json
```

### Programmatic Usage
```javascript
const FrontendDebugger = require('./debug-tool');

const debugger = new FrontendDebugger('http://localhost:3000');
const errors = await debugger.run();

if (errors.summary.totalErrors > 0) {
  console.log('Found errors:', errors);
}
```

---

## Next Steps

1. ✅ Install Playwright: `./setup-debugger.sh`
2. ✅ Start React app: `npm run dev`
3. ✅ Run debugger: `node debug-tool.js`
4. ✅ Review output: `cat frontend-errors.json`
5. ✅ Fix the error: Edit `TabProduct.js`
6. ✅ Verify fix: `node debug-tool.js` (should show 0 errors)

---

## Documentation

- **Quick Start**: `QUICK_START.md` (this file)
- **Full Documentation**: `DEBUG_TOOL_README.md`
- **AI Agent Guide**: `AI_DEBUGGING_GUIDE.md`
- **Example Output**: `example-output.json`

---

## Summary

✅ **Controlled error introduced** in `TabProduct.js`  
✅ **Playwright tool created** in `debug-tool.js`  
✅ **Documentation complete** with 3 comprehensive guides  
✅ **Example output provided** in `example-output.json`  
✅ **Setup script created** for easy installation  

**Result:** AI agents can now automatically detect, analyze, and fix frontend errors without manual intervention.
