const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');

setDefaultTimeout(60000);

Before(async function () {
  this.browser = await chromium.launch({
    headless: process.env.CI ? true : false, // visible locally, headless in Jenkins
    slowMo: process.env.CI ? 0 : 200
  });

  this.context = await this.browser.newContext({
    recordVideo: {
      dir: 'reports/videos/'
    }
  });

  // Start tracing
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true
  });

  this.page = await this.context.newPage();
});

After(async function (scenario) {
  const fileName = scenario.pickle.name.replace(/ /g, "_");

  try {
    // 📸 Screenshot on failure
    if (scenario.result.status === 'FAILED' && this.page) {
      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/${fileName}.png`
      });
      await this.attach(screenshot, 'image/png');
    }

    // 🧪 Stop tracing BEFORE closing context
    if (this.context && this.context.tracing) {
      await this.context.tracing.stop({
        path: `reports/traces/${fileName}.zip`
      });
    }

    // 🎥 Handle video (with delay to avoid EBUSY)
    if (this.page && this.page.video) {
      const video = this.page.video();
      if (video) {
        const videoPath = await video.path();

        // wait for file to release (IMPORTANT FIX)
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

  // 🔚 Close everything safely (LAST STEP)
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