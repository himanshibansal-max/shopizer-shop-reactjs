# Add this section to your main README.md

---

## 🔍 Frontend Error Debugging Tool

### Overview

This project includes an automated debugging tool that captures browser errors, console logs, and failed network requests using Playwright. Perfect for AI-assisted debugging!

### Quick Start

```bash
# 1. Install Playwright (one-time setup)
./setup-debugger.sh

# 2. Start your React app
npm run dev

# 3. Run the debugger (in a separate terminal)
node debug-tool.js
```

### What It Captures

- ✅ Console errors with stack traces
- ✅ Uncaught JavaScript exceptions
- ✅ Failed network requests (404, 500, etc.)
- ✅ Full-page screenshots
- ✅ Complete request/response details

### Output

The tool generates:
- `frontend-errors.json` - Structured error data
- `frontend-errors.png` - Visual screenshot

### Example Output

```json
{
  "summary": {
    "totalErrors": 2,
    "consoleErrorCount": 1,
    "networkErrorCount": 1
  },
  "networkErrors": [
    {
      "url": "http://localhost:8080/api/v1/...",
      "status": 404,
      "method": "GET"
    }
  ]
}
```

### Documentation

- **Quick Start**: `QUICK_START.md`
- **Full Documentation**: `DEBUG_TOOL_README.md`
- **AI Integration Guide**: `AI_DEBUGGING_GUIDE.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`

### Demo Error

The project includes a controlled error for demonstration:
- **File**: `src/wrappers/product/TabProduct.js` (line 32)
- **Error**: 404 on `/api/v1/products/group/FEATURED_ITEM_BROKEN`
- **Fix**: Change `FEATURED_ITEM_BROKEN` to `FEATURED_ITEM`

### Benefits

- 🤖 **AI-Friendly**: Structured JSON output
- ⚡ **Fast**: Automated error detection
- 📸 **Visual**: Screenshot for context
- 🔄 **Reproducible**: Same command every time
- 🎯 **Complete**: All error types in one scan

---
