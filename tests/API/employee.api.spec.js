const { test, expect } = require('../../fixtures');
const { API_ENDPOINTS, generateApiEmployeeData } = require('../../test-data/api.data');

test.describe('@api Employee API — CRUD', () => {

    test('should return employee list', async ({ apiClient }) => {
        const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES}?limit=10&offset=0`);
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
    });

    test('should create a new employee', async ({ apiClient }) => {
        const employee = generateApiEmployeeData();
        const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
        expect(response.data).toBeDefined();
        expect(response.data.firstName).toBe(employee.firstName);
        expect(response.data.lastName).toBe(employee.lastName);
        expect(response.data.empNumber).toBeDefined();
    });

    test('should get employee by empNumber', async ({ apiClient }) => {
        const employee = generateApiEmployeeData();
        const created = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
        const empNumber = created.data.empNumber;

        const response = await apiClient.get(API_ENDPOINTS.EMPLOYEE_BY_ID(empNumber));
        expect(response.data.empNumber).toBe(empNumber);
        expect(response.data.firstName).toBe(employee.firstName);
    });

    test('should update employee last name', async ({ apiClient }) => {
        const employee = generateApiEmployeeData();
        const created = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
        const empNumber = created.data.empNumber;
        const updatedLastName = `Updated${Date.now()}`;

        // Personal details sub-resource for name updates
        const response = await apiClient.put(
            API_ENDPOINTS.EMPLOYEE_PERSONAL_DETAILS(empNumber),
            { firstName: employee.firstName, middleName: employee.middleName, lastName: updatedLastName },
        );
        expect(response.status, `PUT returned ${response.status}`).toBe(200);
        expect(response.data.lastName).toBe(updatedLastName);
    });

    test('should delete employee and confirm removal', async ({ apiClient }) => {
        const employee = generateApiEmployeeData();
        const created = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
        const empNumber = created.data.empNumber;

        const { status: delStatus } = await apiClient.delete(API_ENDPOINTS.EMPLOYEES, { ids: [empNumber] });
        expect(delStatus).toBe(200);

        const { status: getStatus } = await apiClient.get(API_ENDPOINTS.EMPLOYEE_BY_ID(empNumber));
        expect([404, 422], `Expected employee to be gone (404/422) but got ${getStatus}`).toContain(getStatus);
    });
});
