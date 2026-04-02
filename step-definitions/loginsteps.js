const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const LoginPage = require("../pages/login.js");

Given("I open the login page", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
});

When("I enter {string} as username and {string} as password", async function (username, password) {
  await this.loginPage.login(username, password);
});

Then("I should see dashboard", async function () {
  await expect(this.page).toHaveURL(/dashboard/);
});

When("I logout from the application", async function () {
  await this.loginPage.logout();
});

Then("I should see login page", async function () {
  await expect(this.page).toHaveURL(/login/);
});