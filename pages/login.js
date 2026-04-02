class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginBtn = page.locator('button[type="submit"]');

    this.userMenu = page.locator('.oxd-userdropdown-tab');
    this.logoutBtn = page.locator('a[href*="logout"]');
  }

  async open(url) {
  console.log("Opening login page...");

  await this.page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  await this.page.waitForSelector('input[name="username"]', {
    state: "visible",
    timeout: 60000
  });
}

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();

    await this.page.waitForURL(/dashboard/);

    await this.userMenu.waitFor({ state: "visible" });
  }

  async logout() {
    await this.userMenu.click();

    await this.logoutBtn.waitFor({ state: "visible" });

    await this.logoutBtn.click();
    await this.page.waitForURL(/login/);
    await this.username.waitFor({ state: "visible" });
  }
}

module.exports = LoginPage;