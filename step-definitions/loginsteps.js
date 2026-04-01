const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect } = require('chai');
const LoginPage = require('../pages/login');

Given('I open the login page of url {string}', async function (url) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage(url);
});

When('I enter Admin as username and admin123 as password', async function () {
  await this.loginPage.login('Admin', 'admin123');
});

Then('I should see dashboard of url {string}', async function (url) {
  const currentUrl = this.page.url();
  expect(currentUrl).to.equal(url);
});

When('I logout from the application', async function () {
  await this.loginPage.logout();
});

Then('I should see login page url {string}', async function (url) {
  const currentUrl = this.page.url();
  expect(currentUrl).to.equal(url);
});