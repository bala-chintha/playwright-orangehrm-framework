const { test, expect } = require('@playwright/test');
const { POManager } = require('../../pages/POManager');

test.describe('@smoke Login', () => {

    let loginPage;

    test.beforeEach(async ({ page }) => {
        const poManager = new POManager(page);
        loginPage = poManager.getLoginPage();
        await loginPage.goto();
    });

    test('valid credentials should redirect to dashboard', async ({ page }) => {
        await loginPage.login(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD
        );
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.getByRole('heading', { name: 'Dashboard' }))
            .toBeVisible();
    });

    test('invalid credentials should show error alert', async ({ page }) => {
        await loginPage.login('wronguser', 'wrongpass');
        const error = await loginPage.getErrorAlertText();
        expect(error).toContain('Invalid credentials');
    });

    test('empty submit should show required validation', async ({ page }) => {
        await loginPage.login('', '');
        const fieldError = await loginPage.getValidationErrorText();
        expect(fieldError).toContain('Required');
    });

});