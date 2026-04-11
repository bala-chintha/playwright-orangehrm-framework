const { test: base } = require('@playwright/test');
const { POManager } = require('../pages/POManager');

exports.test = base.extend({

    poManager: async ({ page }, use) => {
        await use(new POManager(page));
    },

    loginPage: async ({ poManager }, use) => {
        await use(poManager.getLoginPage());
    },

    dashboardPage: async ({ poManager }, use) => {
        await use(poManager.getDashboardPage());
    },

    pimPage: async ({ poManager }, use) => {
        await use(poManager.getPimPage());
    },

    addEmployeePage: async ({ poManager }, use) => {
        await use(poManager.getAddEmployeePage());
    },

    authenticatedPage: async ({ page, loginPage }, use) => {
        await loginPage.goto();
        await loginPage.login(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD
        );
        await page.waitForURL('**/dashboard**');
        await use();
    },

});

exports.expect = require('@playwright/test').expect;