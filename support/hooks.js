const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');

setDefaultTimeout(60000);

Before(async function () {
  this.browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  this.context = await this.browser.newContext({
    recordVideo: {
      dir: 'reports/videos/'
    }
  });

  // START TRACE
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true
  });

  this.page = await this.context.newPage();
});

After(async function (scenario) {
  const fileName = scenario.pickle.name.replace(/ /g, "_");
  await this.page.close();
  await this.context.close();
  await this.browser.close();

  //  Screenshot on failure
  if (scenario.result.status === 'FAILED') {
    const screenshot = await this.page.screenshot({
      path: `reports/screenshots/${fileName}.png`
    });

    await this.attach(screenshot, 'image/png');
  }

  // Handle video
  const video = this.page.video();
  if (video) {
    const videoPath = await video.path();

    if (scenario.result.status === 'FAILED') {
      const newPath = `reports/videos/${fileName}.webm`;
      fs.renameSync(videoPath, newPath);
    } else {
      fs.unlinkSync(videoPath);
    }
  }

  await this.context.tracing.stop({
    path: `reports/traces/${fileName}.zip`
  });

  await this.browser.close();
});