const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');

setDefaultTimeout(60000);

Before(async function () {
  this.browser = await chromium.launch({
    headless: process.env.CI ? true : false,
    slowMo: process.env.CI ? 0 : 200
  });

  this.context = await this.browser.newContext({
    recordVideo: {
      dir: 'reports/videos/'
    }
  });

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true
  });

  this.page = await this.context.newPage();
});

After(async function (scenario) {
  const fileName = scenario.pickle.name.replace(/ /g, "_");

  try {
    if (scenario.result.status === 'FAILED' && this.page) {
      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/${fileName}.png`
      });
      await this.attach(screenshot, 'image/png');
    }

    if (this.context && this.context.tracing) {
      await this.context.tracing.stop({
        path: `reports/traces/${fileName}.zip`
      });
    }

    if (this.page && this.page.video) {
      const video = this.page.video();
      if (video) {
        const videoPath = await video.path();

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (scenario.result.status === 'FAILED') {
          const newPath = `reports/videos/${fileName}.webm`;
          fs.renameSync(videoPath, newPath);
        } else {
          try {
            fs.unlinkSync(videoPath);
          } catch (err) {
            console.log("Video delete skipped:", err.message);
          }
        }
      }
    }

  } catch (err) {
    console.log("After hook error:", err.message);
  }

  try {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  } catch (err) {
    console.log("Cleanup error:", err.message);
  }
});