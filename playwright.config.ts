import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { getWsEndpoint, isCloudRun } from './src/config/capabilities';

dotenv.config();

const cloud = isCloudRun();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.testmuai.com/selenium-playground/',
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'on',
    video: 'on',
    trace: 'retain-on-failure',
  },

  projects: [
    // Local runs
    { name: 'local-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'local-firefox', use: { ...devices['Desktop Firefox'] } },

    // Cloud runs (HyperExecute / LambdaTest grid). Used only when LT_USERNAME and LT_ACCESS_KEY are set.
    {
      name: 'chrome-win',
      use: { connectOptions: cloud ? { wsEndpoint: getWsEndpoint('Windows 10') } : undefined },
    },
    {
      name: 'chrome-linux',
      use: { connectOptions: cloud ? { wsEndpoint: getWsEndpoint('Linux') } : undefined },
    },
  ],
});
