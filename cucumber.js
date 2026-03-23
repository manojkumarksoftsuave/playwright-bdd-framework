module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'step-definitions/**/*.js',
      'support/hooks.js'  
    ],
    format: [
      'progress',
      'json:reports/cucumber-report.json'
    ],
    timeout: 60000
  }
};