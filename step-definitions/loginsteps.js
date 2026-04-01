const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect } = require('chai');
const LoginPage = require('../pages/login');

Given('I open the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
});

When('I enter {string} as username and {string} as password', async function (username, password) {
  await this.loginPage.login(username, password);
});

Then('I should see dashboard', async function () {
  const currentUrl = this.page.url();
  expect(currentUrl).to.equal("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
});

When('I logout from the application', async function () {
  await this.loginPage.logout();
});

Then('I should see login page', async function () {
  const currentUrl = this.page.url();
  expect(currentUrl).to.equal("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
});