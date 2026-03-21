class BasePage {

    constructor(page) {
        this.page = page;
    }

    async navigate(path) {
        await this.page.goto(path);
    }

    async waitForElement(locator) {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
    }
}

module.exports = { BasePage };