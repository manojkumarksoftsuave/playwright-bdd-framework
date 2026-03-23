class LoginPage {
  constructor(page) {
    this.page = page;

    // Login locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');

    // ✅ Logout locators
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('a[href*="logout"]');
  }

  async navigateToLoginPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();

    // wait for dashboard
    await this.page.waitForURL(/dashboard/);
  }

  // 🔥 LOGOUT METHODS

  async clickUserDropdown() {
    await this.userDropdown.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async logout() {
    await this.clickUserDropdown();
    await this.page.waitForTimeout(1000); // small wait for dropdown
    await this.clickLogout();

    await this.page.waitForURL(/login/);
    console.log("Logout successful");
  }
}

module.exports = LoginPage;