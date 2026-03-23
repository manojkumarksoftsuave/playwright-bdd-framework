const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.page = null;
    this.browser = null;
  }
}

setWorldConstructor(CustomWorld);
