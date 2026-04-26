const { test, expect } = require('../../fixtures');
const { API_ENDPOINTS, generateApiEmployeeData } = require('../../test-data/api.data');

test.describe('@api @hybrid Hybrid API + UI', () => {

    test('employee created via API should appear in UI',
        async ({ apiClient, authenticatedPage, pimPage }) => {
            const employee = generateApiEmployeeData();

            await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
                firstName: employee.firstName,
                middleName: employee.middleName,
                lastName: employee.lastName,
            });

            await pimPage.goto();
            await pimPage.searchByName(employee.lastName);

            const count = await pimPage.getRowCount();
            expect(count, 'Employee created via API should appear in UI').toBeGreaterThan(0);
        },
    );
});
