import { defineConfig } from '@playwright/test';

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env');
}

const FRONTEND_BASE = process.env.PW_FRONTEND_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: FRONTEND_BASE,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host localhost --port 5173 --strictPort',
    url: FRONTEND_BASE,
    reuseExistingServer: true,
    timeout: 120000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
