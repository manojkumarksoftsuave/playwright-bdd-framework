const { Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const fs = require("fs");
const allure = require('allure-js-commons');

setDefaultTimeout(60000);

function ensureDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

Before(async function () {
  ensureDir("screenshots");
  ensureDir("videos");

  const isCI = process.env.CI === "true";

  this.browser = await chromium.launch({
    headless: isCI
  });

  this.context = await this.browser.newContext({
    recordVideo: { dir: "videos/" }
  });

  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result.status === "FAILED") {
    const path = `screenshots/${Date.now()}.png`;
    const screenshot = await this.page.screenshot({ path });

    await this.attach(screenshot, "image/png");
  }

  await this.context.close();
  await this.browser.close();

  if (scenario.result.status !== "FAILED") {
    const files = fs.readdirSync("videos");
    files.forEach(f => fs.unlinkSync(`videos/${f}`));
  }
});