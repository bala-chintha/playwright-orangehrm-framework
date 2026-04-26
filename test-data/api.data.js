const API_ENDPOINTS = {
    EMPLOYEES: '/web/index.php/api/v2/pim/employees',
    EMPLOYEE_BY_ID: (n) => `/web/index.php/api/v2/pim/employees/${n}`,
    EMPLOYEE_PERSONAL_DETAILS: (n) => `/web/index.php/api/v2/pim/employees/${n}/personal-details`,

    LEAVE_TYPES: '/web/index.php/api/v2/leave/leave-types',
    LEAVE_ENTITLEMENTS: '/web/index.php/api/v2/leave/leave-entitlements',
    LEAVE_PERIODS: '/web/index.php/api/v2/leave/leave-periods',

    USERS: '/web/index.php/api/v2/admin/users',
    USER_BY_ID: (id) => `/web/index.php/api/v2/admin/users/${id}`,
};

const generateApiEmployeeData = () => {
    const ts = Date.now();
    return { firstName: 'Api', middleName: 'Test', lastName: `User${ts}` };
};

const generateApiUserData = (empNumber) => {
    const ts = Date.now();
    return {
        userRoleId: 2,          // 2 = ESS
        empNumber,
        username: `apiuser${ts}`,
        password: 'Admin@1234',
        status: true,
    };
};

const generateLeaveEntitlementData = (empNumber, leaveTypeId, fromDate, toDate) => {
    const year = new Date().getFullYear();
    return {
        empNumber,
        leaveTypeId,
        entitlement: 5,
        fromDate: fromDate ?? `${year}-01-01`,
        toDate: toDate ?? `${year}-12-31`,
    };
};

module.exports = {
    API_ENDPOINTS,
    generateApiEmployeeData,
    generateApiUserData,
    generateLeaveEntitlementData,
};