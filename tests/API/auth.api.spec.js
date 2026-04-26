require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { request } = require('@playwright/test');
const { API_ENDPOINTS } = require('../../test-data/api.data');
const path = require('path');

const AUTH_FILE = path.resolve(__dirname, '../../playwright/.auth/auth.json');

test.describe('@api Authentication — session cookie', () => {

    test('valid session cookie grants access to protected API', async () => {
        const ctx = await request.newContext({
            baseURL: process.env.BASE_URL,
            storageState: AUTH_FILE,
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: { 'Accept': 'application/json' },
        });

        const res = await ctx.get(`${API_ENDPOINTS.EMPLOYEES}?limit=1&offset=0`);
        expect(res.status(), 'Should return 200 with valid session').toBe(200);

        const body = await res.json();
        expect(body.data, 'Response envelope should have data field').toBeDefined();
        await ctx.dispose();
    });

    test('request without session cookie is rejected', async () => {
        const ctx = await request.newContext({
            baseURL: process.env.BASE_URL,
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: { 'Accept': 'application/json' },
        });

        const res = await ctx.get(`${API_ENDPOINTS.EMPLOYEES}?limit=1&offset=0`);
        expect([401, 403], `Expected 401 or 403 without a session, got ${res.status()}`).toContain(res.status());
        await ctx.dispose();
    });
});
