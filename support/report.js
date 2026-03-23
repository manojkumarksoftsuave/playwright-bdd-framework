const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const reportsDir = path.join(process.cwd(), 'reports');
const jsonPath = path.join(reportsDir, 'cucumber-report.json');
const htmlPath = path.join(reportsDir, 'cucumber-report.html');

function generateReport() {
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  if (!fs.existsSync(jsonPath)) {
    console.log('No cucumber JSON found. Skipping HTML report.');
    return;
  }

  reporter.generate({
    theme: 'bootstrap',
    jsonFile: jsonPath,
    output: htmlPath,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
      Browser: 'Chromium',
      Platform: process.platform,
      Executed: 'Local'
    }
  });

  console.log('Cucumber HTML report generated');
}

// Only generate the HTML report when this file is executed directly.
if (require.main === module) {
  generateReport();
}
// Exporting correctly to prevent editor/TS false syntax errors
module.exports.generateReport = generateReport;
