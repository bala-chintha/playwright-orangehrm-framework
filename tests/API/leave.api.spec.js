const { test, expect } = require('../../fixtures');
const { API_ENDPOINTS, generateApiEmployeeData, generateLeaveEntitlementData } = require('../../test-data/api.data');

test.describe('@api Leave API', () => {

    let leaveTypeId;
    let testEmpNumber;
    let leavePeriodFrom;
    let leavePeriodTo;

    test.beforeAll(async ({ apiClient }) => {

        const emp = generateApiEmployeeData();
        const created = await apiClient.post(API_ENDPOINTS.EMPLOYEES, {
            firstName: emp.firstName,
            middleName: emp.middleName,
            lastName: emp.lastName,
        });
        testEmpNumber = created.data.empNumber;
        console.log(`[Leave API] empNumber: ${testEmpNumber}`);


        const periodsResponse = await apiClient.get(API_ENDPOINTS.LEAVE_PERIODS);
        expect(periodsResponse.status, `GET leave-periods returned ${periodsResponse.status}`).toBe(200);

        const period = Array.isArray(periodsResponse.data) ? periodsResponse.data[0] : periodsResponse.data;
        leavePeriodFrom = period.startDate ?? period.fromDate;
        leavePeriodTo = period.endDate ?? period.toDate;
        console.log(`[Leave API] leave period: ${leavePeriodFrom} → ${leavePeriodTo}`);

        const leaveTypes = await apiClient.get(API_ENDPOINTS.LEAVE_TYPES);
        expect(leaveTypes.data.length).toBeGreaterThan(0);
        leaveTypeId = leaveTypes.data[0].id;
        console.log(`[Leave API] leaveTypeId: ${leaveTypeId}`);
    });

    test.afterAll(async ({ apiClient }) => {
        if (testEmpNumber) {
            await apiClient.delete(API_ENDPOINTS.EMPLOYEES, { ids: [testEmpNumber] }).catch(() => { });
        }
    });

    test('should fetch all leave types', async ({ apiClient }) => {
        const response = await apiClient.get(API_ENDPOINTS.LEAVE_TYPES);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('name');
    });

    test('should create a leave entitlement for employee', async ({ apiClient }) => {

        const payload = generateLeaveEntitlementData(testEmpNumber, leaveTypeId, leavePeriodFrom, leavePeriodTo);
        const response = await apiClient.post(API_ENDPOINTS.LEAVE_ENTITLEMENTS, payload);

        expect(response.status, `POST returned ${response.status} — body: ${JSON.stringify(response.body)}`).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBeDefined();
        expect(response.data.entitlement).toBe(payload.entitlement);
    });

    test('should read leave entitlements for employee', async ({ apiClient }) => {

        await apiClient.post(
            API_ENDPOINTS.LEAVE_ENTITLEMENTS,
            generateLeaveEntitlementData(testEmpNumber, leaveTypeId, leavePeriodFrom, leavePeriodTo),
        );

        const response = await apiClient.get(
            `${API_ENDPOINTS.LEAVE_ENTITLEMENTS}` +
            `?empNumber=${testEmpNumber}` +
            `&leaveTypeId=${leaveTypeId}` +
            `&fromDate=${leavePeriodFrom}` +
            `&toDate=${leavePeriodTo}`,
        );

        expect(response.status, `GET returned ${response.status} — body: ${JSON.stringify(response.body)}`).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
        expect(response.data.length).toBeGreaterThan(0);
    });
});