const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * AI-Powered Error Auto-Fixer
 * 
 * Reads frontend-errors.json and automatically fixes common errors
 */

class ErrorAutoFixer {
  constructor(errorsFile = 'frontend-errors.json') {
    this.errorsFile = errorsFile;
    this.fixes = [];
  }

  async run() {
    console.log('🔧 Starting Auto-Fixer...\n');

    // Read errors
    if (!fs.existsSync(this.errorsFile)) {
      console.log('❌ No error file found. Run debug-tool.js first.');
      return;
    }

    const errors = JSON.parse(fs.readFileSync(this.errorsFile, 'utf-8'));
    
    if (errors.summary.totalErrors === 0) {
      console.log('✨ No errors to fix!');
      return;
    }

    console.log(`📊 Found ${errors.summary.totalErrors} errors\n`);

    // Analyze and fix each error
    for (const error of errors.networkErrors) {
      await this.fixNetworkError(error);
    }

    // Report results
    console.log('\n' + '='.repeat(60));
    console.log('📋 Fix Summary');
    console.log('='.repeat(60));
    
    if (this.fixes.length === 0) {
      console.log('⚠️  No automatic fixes available for these errors.');
      console.log('💡 Manual intervention required.');
    } else {
      this.fixes.forEach((fix, i) => {
        console.log(`\n${i + 1}. ${fix.description}`);
        console.log(`   File: ${fix.file}`);
        console.log(`   Status: ${fix.status}`);
      });
    }

    console.log('\n' + '='.repeat(60));
  }

  async fixNetworkError(error) {
    const url = error.url;
    const status = error.status;
    
    // Fix: INVALID_ENDPOINT_404 → correct endpoint
    if (url.includes('INVALID_ENDPOINT_404') || (status >= 400 && url.includes('/product/'))) {
      console.log(`🔍 Detected: Invalid endpoint (${status} error)`);
      this.fixInvalidEndpoint();
    }
    // Fix: FEATURD_ITEM → FEATURED_ITEM (typo)
    else if (url.includes('FEATURD_ITEM')) {
      console.log('🔍 Detected: Typo in API endpoint (FEATURD_ITEM)');
      this.fixTypoEndpoint();
    }
    // Fix: FEATURED_ITEM_BROKEN → FEATURED_ITEM
    else if (url.includes('FEATURED_ITEM_BROKEN')) {
      console.log('🔍 Detected: Wrong API endpoint (FEATURED_ITEM_BROKEN)');
      this.fixFeaturedItemEndpoint();
    }
    // Fix: headerMessage 404
    else if (url.includes('headerMessage')) {
      console.log('🔍 Detected: Missing headerMessage resource (404)');
      this.fixHeaderMessage();
    }
  }

  fixInvalidEndpoint() {
    const file = 'src/wrappers/product/TabProduct.js';
    const filePath = path.join(process.cwd(), file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes('INVALID_ENDPOINT_404')) {
        // Fix: Use correct endpoint
        content = content.replace(
          /constant\.ACTION\.PRODUCT \+ 'INVALID_ENDPOINT_404\?store=' \+ defaultStore/g,
          "constant.ACTION.PRODUCT_GROUP + 'FEATURED_ITEM?store=' + defaultStore + '&lang=' + currentLanguageCode"
        );
        content = content.replace(/\s*\/\/ INTENTIONAL ERROR:.*\n/g, '');
        
        fs.writeFileSync(filePath, content, 'utf-8');
        
        this.fixes.push({
          description: 'Fixed invalid endpoint → FEATURED_ITEM',
          file: file,
          status: '✅ Fixed'
        });
        
        console.log('✅ Fixed: Replaced INVALID_ENDPOINT_404 with correct endpoint');
        console.log(`   File: ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  fixTypoEndpoint() {
    const file = 'src/wrappers/product/TabProduct.js';
    const filePath = path.join(process.cwd(), file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes('FEATURD_ITEM')) {
        content = content.replace(/FEATURD_ITEM/g, 'FEATURED_ITEM');
        content = content.replace(/\s*\/\/ INTENTIONAL ERROR:.*\n/g, '');
        
        fs.writeFileSync(filePath, content, 'utf-8');
        
        this.fixes.push({
          description: 'Fixed typo: FEATURD_ITEM → FEATURED_ITEM',
          file: file,
          status: '✅ Fixed'
        });
        
        console.log('✅ Fixed: Changed FEATURD_ITEM to FEATURED_ITEM');
        console.log(`   File: ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  fixFeaturedItemEndpoint() {
    const file = 'src/wrappers/product/TabProduct.js';
    const filePath = path.join(process.cwd(), file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      if (content.includes('FEATURED_ITEM_BROKEN')) {
        // Fix the endpoint
        content = content.replace(
          /FEATURED_ITEM_BROKEN/g,
          'FEATURED_ITEM'
        );
        
        // Remove the error comment
        content = content.replace(
          /\s*\/\/ CONTROLLED ERROR:.*\n/g,
          ''
        );
        
        fs.writeFileSync(filePath, content, 'utf-8');
        
        this.fixes.push({
          description: 'Fixed API endpoint: FEATURED_ITEM_BROKEN → FEATURED_ITEM',
          file: file,
          status: '✅ Fixed'
        });
        
        console.log('✅ Fixed: Changed FEATURED_ITEM_BROKEN to FEATURED_ITEM');
        console.log(`   File: ${file}`);
      } else {
        console.log('ℹ️  Already fixed or not found');
      }
    } catch (error) {
      console.log(`❌ Error fixing file: ${error.message}`);
    }
  }

  fixHeaderMessage() {
    const file = 'src/wrappers/header/Header.js';
    const filePath = path.join(process.cwd(), file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Check if the headerMessage call exists
      if (content.includes('headerMessage') || content.includes('HEADER_MESSAGE')) {
        console.log('💡 Suggestion: Remove or handle headerMessage API call');
        console.log(`   File: ${file}`);
        console.log('   Action: Add error handling or remove the call');
        
        this.fixes.push({
          description: 'headerMessage 404 - needs manual review',
          file: file,
          status: '⚠️  Manual fix needed'
        });
      } else {
        console.log('ℹ️  headerMessage call not found in expected location');
      }
    } catch (error) {
      console.log(`ℹ️  Could not analyze ${file}`);
    }
  }
}

// CLI execution
if (require.main === module) {
  const fixer = new ErrorAutoFixer();
  fixer.run().then(() => {
    console.log('\n🏁 Auto-fixer finished.\n');
  });
}

module.exports = ErrorAutoFixer;
