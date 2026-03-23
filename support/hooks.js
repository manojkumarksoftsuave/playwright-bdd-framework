const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

// Increase the default step timeout for slower environments
setDefaultTimeout(60000);

Before(async function () {
  if (typeof this.setDefaultTimeout === 'function') {
    this.setDefaultTimeout(60000);
  }

  console.log('Launching browser...');

  this.browser = await chromium.launch({
    headless: false,   
    slowMo: 500       
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  console.log('Browser launched');
});

After(async function () {
  
  console.log('Closing browser...');
  await this.browser.close();
});