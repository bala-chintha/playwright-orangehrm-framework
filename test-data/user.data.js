const generateUserData = () => {
    const timestamp = Date.now();
    return {
        username: `testuser${timestamp}`,
        password: 'Admin@123456',
        role: 'ESS',
        status: 'Enabled',
        employeeName: 'Manda'
    };
};

const USER_SEARCH_FIXTURES = {
    KNOWN_USERNAME: 'Admin',
};
s
const INVALID_USER_FIXTURES = {
    NONEXISTENT_USERNAME: 'xyzinvaliduser000',
};

module.exports = {
    generateUserData,
    USER_SEARCH_FIXTURES,
    INVALID_USER_FIXTURES,
};