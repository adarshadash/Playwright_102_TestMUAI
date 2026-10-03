import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { getWsEndpoint } from './src/config/capabilities';

dotenv.config();

// RUN_TARGET = local | hyperexecute | lt-grid  (set explicitly; don't infer from credentials)
const target = process.env.RUN_TARGET ?? 'local';
const ltGrid = target === 'lt-grid';

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
    screenshot: process.env.ENABLE_SCREENSHOTS === 'false' ? 'off' : 'on',
    video: ltGrid || process.env.ENABLE_VIDEO === 'false' ? 'off' : 'on',
    trace: 'retain-on-failure',
    // Capture console logs and network activity in traces
    serviceWorkers: 'allow',
  },

  projects: ltGrid
    ? [
        // Remote LambdaTest Playwright grid (orchestrated by HyperExecute)
        { name: 'grid-chrome-win', use: { connectOptions: { wsEndpoint: getWsEndpoint('Windows 10') } } },
        { name: 'grid-chrome-linux', use: { connectOptions: { wsEndpoint: getWsEndpoint('Linux') } } },
      ]
    : target === 'hyperexecute'
    ? [
        // HyperExecute: VMs have Playwright's bundled Chromium but NOT Google Chrome
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      ]
    : [
        // Local development: use native Chrome and Chromium + Firefox
        {
          name: 'chrome',
          use: {
            ...devices['Desktop Chrome'],
            channel: 'chrome',
          },
        },
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
      ],
});