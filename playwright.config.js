require('dotenv').config({ override: false });
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  globalSetup: './global.setup.js',
  use: {
    baseURL: process.env.BASE_URL,
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/tests/UI/**/*.spec.js',
    },
    {
      name: 'api',
      use: {
        actionTimeout: 45000,
      },
      testMatch: '**/tests/API/**/*.spec.js',
      timeout: 120000,
    },
  ],
});