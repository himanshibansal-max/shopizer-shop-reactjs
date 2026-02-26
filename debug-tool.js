const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Playwright-based Frontend Error Debugger
 * 
 * Purpose: Automatically capture browser errors, console logs, and failed network requests
 * for AI-assisted debugging without manual copy-paste.
 * 
 * Usage: node debug-tool.js [url] [output-file]
 * Example: node debug-tool.js http://localhost:3000 errors.json
 */

class FrontendDebugger {
  constructor(url = 'http://localhost:3000', outputFile = 'frontend-errors.json') {
    this.url = url;
    this.outputFile = outputFile;
    this.errors = {
      timestamp: new Date().toISOString(),
      url: url,
      consoleErrors: [],
      pageErrors: [],
      networkErrors: [],
      summary: {
        totalErrors: 0,
        consoleErrorCount: 0,
        pageErrorCount: 0,
        networkErrorCount: 0
      }
    };
  }

  async run() {
    console.log(`🔍 Starting Frontend Debugger...`);
    console.log(`📍 Target URL: ${this.url}`);
    console.log(`📝 Output file: ${this.outputFile}\n`);

    const browser = await chromium.launch({ 
      headless: true,
      args: ['--disable-web-security'] // Allow CORS for local testing
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();

    // Listen for console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.log(`❌ Console Error: ${text}`);
        this.errors.consoleErrors.push({
          type: 'console',
          level: 'error',
          message: text,
          timestamp: new Date().toISOString(),
          location: msg.location()
        });
      } else if (type === 'warning') {
        console.log(`⚠️  Console Warning: ${text}`);
      }
    });

    // Listen for page errors (uncaught exceptions)
    page.on('pageerror', error => {
      console.log(`💥 Page Error: ${error.message}`);
      this.errors.pageErrors.push({
        type: 'uncaught_exception',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Listen for failed network requests
    page.on('response', async response => {
      const status = response.status();
      const url = response.url();
      
      if (status >= 400) {
        console.log(`🌐 Network Error: ${status} - ${url}`);
        
        let responseBody = null;
        try {
          responseBody = await response.text();
        } catch (e) {
          responseBody = 'Unable to read response body';
        }

        this.errors.networkErrors.push({
          type: 'network',
          url: url,
          method: response.request().method(),
          status: status,
          statusText: response.statusText(),
          headers: await response.allHeaders(),
          responseBody: responseBody,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for request failures
    page.on('requestfailed', request => {
      console.log(`🚫 Request Failed: ${request.url()}`);
      this.errors.networkErrors.push({
        type: 'request_failed',
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText || 'Unknown error',
        timestamp: new Date().toISOString()
      });
    });

    try {
      // Navigate to the page
      console.log(`\n🚀 Navigating to ${this.url}...`);
      await page.goto(this.url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Scroll down to trigger lazy-loaded components
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      // Wait a bit for any async errors to surface
      console.log(`⏳ Waiting for errors to surface (10 seconds)...`);
      await page.waitForTimeout(10000);

      // Take a screenshot for visual debugging
      const screenshotPath = this.outputFile.replace('.json', '.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);

      // Calculate summary
      this.errors.summary.consoleErrorCount = this.errors.consoleErrors.length;
      this.errors.summary.pageErrorCount = this.errors.pageErrors.length;
      this.errors.summary.networkErrorCount = this.errors.networkErrors.length;
      this.errors.summary.totalErrors = 
        this.errors.summary.consoleErrorCount + 
        this.errors.summary.pageErrorCount + 
        this.errors.summary.networkErrorCount;

      // Save errors to JSON file
      fs.writeFileSync(
        this.outputFile, 
        JSON.stringify(this.errors, null, 2),
        'utf-8'
      );

      console.log(`\n✅ Debug report saved to: ${this.outputFile}`);
      console.log(`\n📊 Summary:`);
      console.log(`   Total Errors: ${this.errors.summary.totalErrors}`);
      console.log(`   Console Errors: ${this.errors.summary.consoleErrorCount}`);
      console.log(`   Page Errors: ${this.errors.summary.pageErrorCount}`);
      console.log(`   Network Errors: ${this.errors.summary.networkErrorCount}`);

      if (this.errors.summary.totalErrors === 0) {
        console.log(`\n✨ No errors detected!`);
      } else {
        console.log(`\n🔧 Errors detected. Review ${this.outputFile} for details.`);
      }

    } catch (error) {
      console.error(`\n❌ Fatal Error: ${error.message}`);
      this.errors.pageErrors.push({
        type: 'fatal',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      fs.writeFileSync(
        this.outputFile, 
        JSON.stringify(this.errors, null, 2),
        'utf-8'
      );
    } finally {
      await browser.close();
      console.log(`\n🏁 Debugger finished.\n`);
    }

    return this.errors;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:3000';
  const outputFile = args[1] || 'frontend-errors.json';

  const errorDebugger = new FrontendDebugger(url, outputFile);
  errorDebugger.run().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = FrontendDebugger;
