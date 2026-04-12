const generateEmployeeData = () => {
    const timestamp = Date.now();
    return {
        firstName: 'Test',
        middleName: 'Auto',
        lastName: `User${timestamp}`,
    };
};

const EMPLOYEE_SEARCH_FIXTURES = {
    KNOWN_FIRST_NAME: 'John'
};

const INVALID_SEARCH_FIXTURES = {
    NONEXISTENT_NAME: `invalid_emp_${Date.now()}`,
    STATIC_NONEXISTENT_NAME: 'zzzNoSuchEmployee000'
};

module.exports = {
    generateEmployeeData,
    EMPLOYEE_SEARCH_FIXTURES,
    INVALID_SEARCH_FIXTURES,
};