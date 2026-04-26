require('dotenv').config();
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

module.exports = async function globalSetup() {
    const AUTH_FILE = path.resolve(__dirname, 'playwright/.auth/auth.json');
    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    console.log('\n[globalSetup] Logging in to OrangeHRM to capture session cookie...');

    await page.goto(`${process.env.BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', process.env.ADMIN_USERNAME);
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**', { timeout: 30000 });

    await context.storageState({ path: AUTH_FILE });
    console.log(`[globalSetup] Session cookie saved → ${AUTH_FILE}\n`);

    await browser.close();
};
