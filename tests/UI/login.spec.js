const { test, expect } = require('../../fixtures');

test.describe('@smoke Login', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('valid credentials should redirect to dashboard', async ({ page, loginPage }) => {
        await loginPage.login(
            process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD
        );
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('invalid credentials should show error alert', async ({ loginPage }) => {
        await loginPage.login('wronguser', 'wrongpass');
        const error = await loginPage.getErrorAlertText();
        expect(error).toContain('Invalid credentials');
    });

    test('empty submit should show required validation', async ({ loginPage }) => {
        await loginPage.login('', '');
        const fieldError = await loginPage.getValidationErrorText();
        expect(fieldError).toContain('Required');
    });

});