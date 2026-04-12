const { test, expect } = require('../../fixtures');
const { generateUserData, USER_SEARCH_FIXTURES, INVALID_USER_FIXTURES } = require('../../test-data/user.data');

const createUser = async (adminPage, addUserPage) => {
    const user = generateUserData();
    await adminPage.clickAdd();
    await addUserPage.selectUserRole(user.role);
    await addUserPage.selectStatus(user.status);
    await addUserPage.fillEmployeeName(user.employeeName);
    await addUserPage.fillUsername(user.username);
    await addUserPage.fillPassword(user.password);
    await addUserPage.save();
    return user;
};

test.describe('@smoke Admin - User Management', () => {

    test.beforeEach(async ({ authenticatedPage, adminPage }) => {
        await adminPage.goto();
    });

    // READ
    test('should load user list with records', async ({ adminPage }) => {
        const count = await adminPage.getRowCount();
        expect(count, 'User list should contain at least one record').toBeGreaterThan(0);
    });

    test('should navigate to add user page', async ({ adminPage, addUserPage }) => {
        await adminPage.clickAdd();
        expect(await addUserPage.isLoaded(), 'Add user form should be visible').toBeTruthy();
    });

    // CREATE
    test('should add new user successfully', async ({ adminPage, addUserPage }) => {
        await createUser(adminPage, addUserPage);
        const message = await addUserPage.getSuccessMessage();
        expect(message, 'Success toast should appear after adding user').toContain('Successfully Saved');
    });

    // DELETE 
    test('should delete user successfully', async ({ adminPage, addUserPage }) => {
        const user = await createUser(adminPage, addUserPage);

        await adminPage.goto();
        await adminPage.searchByUsername(user.username);
        await adminPage.clickDeleteOnRow(0);
        await adminPage.confirmDelete();

        await adminPage.searchByUsername(user.username);
        expect(await adminPage.isNoRecordsFound(), 'Deleted user should not appear in search results').toBeTruthy();
    });

    test('should search user by username and find results', async ({ adminPage }) => {
        await adminPage.searchByUsername(USER_SEARCH_FIXTURES.KNOWN_USERNAME);
        const count = await adminPage.getRowCount();
        expect(count, `Search for '${USER_SEARCH_FIXTURES.KNOWN_USERNAME}' should return results`).toBeGreaterThan(0);
    });

    test('should show no records for invalid username search', async ({ adminPage }) => {
        await adminPage.searchByUsername(INVALID_USER_FIXTURES.NONEXISTENT_USERNAME);
        expect(await adminPage.isNoRecordsFound(), 'Invalid search should show no records found').toBeTruthy();
    });

    test('should reset search and show all users', async ({ adminPage }) => {
        await adminPage.searchByUsername(INVALID_USER_FIXTURES.NONEXISTENT_USERNAME);
        await adminPage.resetSearch();
        const count = await adminPage.getRowCount();
        expect(count, 'After reset, user list should be restored').toBeGreaterThan(0);
    });
});