module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: [
      "step-definitions/**/*.js",
      "support/hooks.js"
    ],
    format: [
      "progress",
      "summary",
      "json:reports/cucumber-report.json",
      "allure-cucumberjs/reporter"
    ],
    timeout: 60000
  }
};