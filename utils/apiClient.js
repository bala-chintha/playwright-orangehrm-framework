require('dotenv').config();
const { request } = require('@playwright/test');

class ApiClient {
    constructor(baseURL) {
        if (!baseURL) throw new Error('ApiClient: BASE_URL is required. Check your .env file.');
        this.baseURL = baseURL.replace(/\/$/, '');
        this.context = null;
    }

    async authenticate(username, password) {
        await this.dispose();
        const tempCtx = await request.newContext({
            baseURL: this.baseURL,
            ignoreHTTPSErrors: true,
        });

        const res = await tempCtx.post('/web/index.php/api/v2/auth/login', {
            headers: { 'Content-Type': 'application/json' },
            data: { username, password },
        });

        const body = await res.json().catch(() => null);
        await tempCtx.dispose();

        if (!res.ok()) {
            throw new Error(`Auth failed: HTTP ${res.status()} for user "${username}"`);
        }

        const token = body?.data?.token;
        if (!token) {
            throw new Error(`Auth failed: no token in response — got: ${JSON.stringify(body)}`);
        }

        this.context = await request.newContext({
            baseURL: this.baseURL,
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        return token;
    }

    async get(endpoint) { return this._send('get', endpoint); }
    async post(endpoint, data) { return this._send('post', endpoint, data); }
    async put(endpoint, data) { return this._send('put', endpoint, data); }
    async delete(endpoint, data = null) { return this._send('delete', endpoint, data); }

    async dispose() {
        if (this.context) {
            await this.context.dispose().catch(() => { });
            this.context = null;
        }
    }

    _checkAuth() {
        if (!this.context) {
            throw new Error('ApiClient: not authenticated. Call authenticate() first.');
        }
    }

    async _send(method, endpoint, data = null) {
        this._checkAuth();
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        const options = {};
        if (data !== null) options.data = data;

        const response = await this.context[method](url, options);
        return this._parseResponse(response);
    }

    async _parseResponse(response) {
        const text = await response.text();
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch { body = text; }
        return {
            status: response.status(),
            ok: response.ok(),
            body,
            data: body?.data ?? null,
        };
    }
}

module.exports = { ApiClient };
