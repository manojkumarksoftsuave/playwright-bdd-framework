
const fs = require("fs");

if (!fs.existsSync("reports")) {
  fs.mkdirSync("reports");
}

reporter.generate({
  jsonDir: "reports",
  reportPath: "reports/html",
  metadata: {
    browser: { name: "chromium", version: "latest" },
    device: "local",
    platform: { name: process.platform }
  }
});