const { test, expect } = require('../../fixtures');
const { generateEmployeeData, EMPLOYEE_SEARCH_FIXTURES, INVALID_SEARCH_FIXTURES } = require('../../test-data/employee.data');

const createEmployee = async (pimPage, addEmployeePage) => {
    const employee = generateEmployeeData();
    await pimPage.clickAdd();
    await addEmployeePage.fillDetails(
        employee.firstName,
        employee.middleName,
        employee.lastName
    );
    await addEmployeePage.save();
    return employee;
};

test.describe('@smoke @pim PIM - Employee Management', () => {

    test.beforeEach(async ({ authenticatedPage, pimPage }) => {
        await pimPage.goto();
    });

    // READ
    test('should load employee list with records', async ({ pimPage }) => {
        const count = await pimPage.getRowCount();
        expect(count, 'Employee list should contain at least one record').toBeGreaterThan(0);
    });

    test('should navigate to add employee page', async ({ pimPage, addEmployeePage }) => {
        await pimPage.clickAdd();
        expect(await addEmployeePage.isLoaded(), 'Add employee form should be visible').toBeTruthy();
    });

    // CREATE
    test('should add new employee successfully', async ({ pimPage, addEmployeePage }) => {
        const employee = await createEmployee(pimPage, addEmployeePage);
        const message = await addEmployeePage.getSuccessMessage();
        expect(message, 'Success toast should appear after adding employee').toContain('Successfully Saved');
    });

    // UPDATE
    test('should edit employee successfully',
        async ({ pimPage, addEmployeePage }) => {
            const employee = await createEmployee(pimPage, addEmployeePage);

            await pimPage.goto();
            await pimPage.searchByName(employee.lastName);
            await pimPage.clickEditOnRow(0);

            const updatedLastName = `Updated${Date.now()}`;
            await addEmployeePage.fillDetails(
                employee.firstName,
                employee.middleName,
                updatedLastName
            );
            await addEmployeePage.save();
            const message = await addEmployeePage.getSuccessMessage();
            expect(message, 'Success toast should appear after editing employee').toContain('Successfully Updated');
        }
    );

    // DELETE
    test('should delete employee successfully', async ({ pimPage, addEmployeePage }) => {
        const employee = await createEmployee(pimPage, addEmployeePage);

        await pimPage.goto();
        await pimPage.searchByName(employee.lastName);
        await pimPage.clickDeleteOnRow(0);
        await pimPage.confirmDelete();

        await pimPage.searchByName(employee.lastName);
        expect(await pimPage.isNoRecordsFound(), 'Deleted employee should not appear in search results').toBeTruthy();
    });

    test('should search employee by name and find results', async ({ pimPage }) => {
        await pimPage.searchByName(EMPLOYEE_SEARCH_FIXTURES.KNOWN_FIRST_NAME);
        const count = await pimPage.getRowCount();
        expect(count, `Search for '${EMPLOYEE_SEARCH_FIXTURES.KNOWN_FIRST_NAME}' should return at least one result`).toBeGreaterThan(0);
    });

    test('should show no records for invalid employee search', async ({ pimPage }) => {
        await pimPage.searchByName(INVALID_SEARCH_FIXTURES.NONEXISTENT_NAME);
        expect(await pimPage.isNoRecordsFound()).toBeTruthy();
    });

    test('should reset search and show all employees', async ({ pimPage }) => {
        await pimPage.searchByName(INVALID_SEARCH_FIXTURES.STATIC_NONEXISTENT_NAME);
        await pimPage.resetSearch();
        const count = await pimPage.getRowCount();
        expect(count, 'After reset, employee list should be restored').toBeGreaterThan(0);
    });

});