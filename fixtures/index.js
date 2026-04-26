require('dotenv').config();
const { test: base, request } = require('@playwright/test');
const { POManager } = require('../pages/POManager');
const path = require('path');

const AUTH_FILE = path.resolve(__dirname, '../playwright/.auth/auth.json');

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

    leavePage: async ({ poManager }, use) => {
        await use(poManager.getLeavePage());
    },

    applyLeavePage: async ({ poManager }, use) => {
        await use(poManager.getApplyLeavePage());
    },

    adminPage: async ({ poManager }, use) => {
        await use(poManager.getAdminPage());
    },

    addUserPage: async ({ poManager }, use) => {
        await use(poManager.getAddUserPage());
    },

    // authenticated fixture — logs in once, available to all tests
    authenticatedPage: async ({ page, loginPage }, use) => {
        await loginPage.goto();
        await loginPage.login(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD
        );
        await page.waitForURL('**/dashboard**');
        await use(page);
    },

    apiClient: [
        async ({ }, use) => {
            const ctx = await request.newContext({
                baseURL: process.env.BASE_URL,
                storageState: AUTH_FILE,
                ignoreHTTPSErrors: true,
                extraHTTPHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            await use({
                get: (ep) => _call(ctx, 'get', ep),
                post: (ep, data) => _call(ctx, 'post', ep, data),
                put: (ep, data) => _call(ctx, 'put', ep, data),
                delete: (ep, data) => _call(ctx, 'delete', ep, data),
            });

            await ctx.dispose();
        },
        { scope: 'worker' },
    ],

});

exports.expect = require('@playwright/test').expect;

async function _call(ctx, method, endpoint, data = null) {
    const opts = {};
    if (data !== null) opts.data = data;

    const res = await ctx[method](endpoint, opts);
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    return {
        status: res.status(),
        ok: res.ok(),
        body,
        data: body?.data ?? null,
    };
}
