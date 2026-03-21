const { LoginPage } = require('./LoginPage');

class POManager {

    constructor(page) {
        this.page = page;

    }
    getLoginPage() {
        if (!this.loginPage) {
            this.loginPage = new LoginPage(this.page);
        }
        return this.loginPage;
    }
}

module.exports = { POManager };