const { test, expect } = require('../../fixtures');

test.describe('@smoke Dashboard', () => {

    test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
        await dashboardPage.goto();
    });

    test('should display dashboard heading', async ({ dashboardPage }) => {
        await expect(dashboardPage.heading).toBeVisible();
    });

    test('should display logged in username', async ({ dashboardPage }) => {
        const username = await dashboardPage.getUserName();
        expect(username).toBeTruthy();
        expect(username.length).toBeGreaterThan(0);
    });

    test('should navigate to PIM via sidebar', async ({ page, dashboardPage }) => {
        await dashboardPage.sidebar.navigateTo('pim');
        await expect(page).toHaveURL(/viewEmployeeList/);
    });

    test('should navigate to Leave via sidebar', async ({ page, dashboardPage }) => {
        await dashboardPage.sidebar.navigateTo('leave');
        await expect(page).toHaveURL(/viewLeaveList/);
    });

    test('should navigate to Admin via sidebar', async ({ page, dashboardPage }) => {
        await dashboardPage.sidebar.navigateTo('admin');
        await expect(page).toHaveURL(/viewSystemUsers/);
    });

    test('should logout successfully', async ({ page, dashboardPage }) => {
        await dashboardPage.logout();
        await expect(page).toHaveURL(/auth\/login/);
    });

});