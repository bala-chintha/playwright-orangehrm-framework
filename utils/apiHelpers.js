require('dotenv').config();
const { ApiClient } = require('./apiClient');

const createApiClient = async () => {
    const client = new ApiClient(process.env.BASE_URL);
    await client.authenticate(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    return client;
};

const getFutureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getCurrentYear = () => new Date().getFullYear();
const generateUniqueId = (prefix = 'auto') => {
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}_${Date.now()}_${suffix}`;
};

module.exports = {
    createApiClient,
    getFutureDate,
    getCurrentYear,
    generateUniqueId,
};
