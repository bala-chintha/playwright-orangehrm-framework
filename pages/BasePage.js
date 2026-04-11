class BasePage {

    constructor(page) {
        this.page = page;
    }

    async navigate(path) {
        await this.page.goto(path, { waitUntil: 'commit' });
    }

    async waitForElement(locator) {
        await locator.waitFor({ state: 'visible' });
    }
}

module.exports = { BasePage };