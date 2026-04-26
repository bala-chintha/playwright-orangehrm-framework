const { test, expect } = require('../../fixtures');
const { API_ENDPOINTS, generateApiEmployeeData, generateApiUserData } = require('../../test-data/api.data');

test.describe('@api User API — CRUD', () => {

    let testEmpNumber;

    test.beforeAll(async ({ apiClient }) => {
        const emp = generateApiEmployeeData();
        const created = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: emp.firstName,
            middleName: emp.middleName,
            lastName: emp.lastName,
        });
        testEmpNumber = created.data.empNumber;
        console.log(`[User API] Setup: empNumber ${testEmpNumber}`);
    });

    test.afterAll(async ({ apiClient }) => {
        if (testEmpNumber) {
            await apiClient.delete(API_ENDPOINTS.EMPLOYEES, { ids: [testEmpNumber] }).catch(() => { });
        }
    });

    test('should return list of system users', async ({ apiClient }) => {
        const response = await apiClient.get(`${API_ENDPOINTS.USERS}?limit=10&offset=0`);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
    });

    test('should create a new ESS user', async ({ apiClient }) => {
        const userData = generateApiUserData(testEmpNumber);
        const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBeDefined();
        expect(response.data.userName).toBe(userData.username);
    });

    test('should get user by ID', async ({ apiClient }) => {
        const userData = generateApiUserData(testEmpNumber);
        const created = await apiClient.post(API_ENDPOINTS.USERS, userData);
        const userId = created.data.id;

        const response = await apiClient.get(API_ENDPOINTS.USER_BY_ID(userId));
        expect(response.data.id).toBe(userId);
        expect(response.data.userName).toBe(userData.username);
    });

    test('should update user status to disabled', async ({ apiClient }) => {
        const userData = generateApiUserData(testEmpNumber);
        const created = await apiClient.post(API_ENDPOINTS.USERS, userData);
        const userId = created.data.id;

        const putPayload = {
            username: userData.username,
            password: userData.password,
            changePassword: false,
            status: false,
            userRoleId: userData.userRoleId,
            empNumber: testEmpNumber,
        };

        const response = await apiClient.put(
            API_ENDPOINTS.USER_BY_ID(userId),
            putPayload,
        );

        expect(response.status, `PUT returned ${response.status} — body: ${JSON.stringify(response.body)}`).toBe(200);
        expect(response.data.status).toBe(false);
    });

    test('should delete user and confirm removal', async ({ apiClient }) => {
        const userData = generateApiUserData(testEmpNumber);
        const created = await apiClient.post(API_ENDPOINTS.USERS, userData);
        const userId = created.data.id;

        await apiClient.delete(API_ENDPOINTS.USERS, { ids: [userId] });

        const response = await apiClient.get(`${API_ENDPOINTS.USERS}?limit=50&offset=0`);
        const stillExists = (response.data ?? []).some((u) => u.id === userId);
        expect(stillExists, 'Deleted user should not appear in list').toBeFalsy();
    });
});