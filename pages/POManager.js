const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { PimPage } = require('./pim/PimPage');
const { AddEmployeePage } = require('./pim/AddEmployeePage');

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

    getDashboardPage() {
        if (!this.dashboardPage) {
            this.dashboardPage = new DashboardPage(this.page);
        }
        return this.dashboardPage;
    }

    getPimPage() {
        if (!this.pimPage) {
            this.pimPage = new PimPage(this.page);
        }
        return this.pimPage;
    }

    getAddEmployeePage() {
        if (!this.addEmployeePage) {
            this.addEmployeePage = new AddEmployeePage(this.page);
        }
        return this.addEmployeePage;
    }
}

module.exports = { POManager };