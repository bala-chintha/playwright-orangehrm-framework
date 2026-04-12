const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { PimPage } = require('./pim/PimPage');
const { AddEmployeePage } = require('./pim/AddEmployeePage');
const { LeavePage } = require('./leave/LeavePage');
const { ApplyLeavePage } = require('./leave/ApplyLeavePage');
const { AdminPage } = require('./admin/AdminPage');
const { AddUserPage } = require('./admin/AddUserPage');

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

    getLeavePage() {
        if (!this.leavePage) {
            this.leavePage = new LeavePage(this.page);
        }
        return this.leavePage;
    }

    getApplyLeavePage() {
        if (!this.applyLeavePage) {
            this.applyLeavePage = new ApplyLeavePage(this.page);
        }
        return this.applyLeavePage;
    }

    getAdminPage() {
        if (!this.adminPage) {
            this.adminPage = new AdminPage(this.page);
        }
        return this.adminPage;
    }

    getAddUserPage() {
        if (!this.addUserPage) {
            this.addUserPage = new AddUserPage(this.page);
        }
        return this.addUserPage;
    }
}

module.exports = { POManager };