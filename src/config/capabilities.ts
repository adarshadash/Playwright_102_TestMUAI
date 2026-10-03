// LambdaTest's Playwright grid offers Windows and macOS only — it has no Linux platform.
export type CloudPlatform = 'Windows 10' | 'MacOS Monterey';

// LambdaTest selects the grid-side Playwright build from this, so it has to be the version
// actually installed here rather than a literal that silently drifts out of date.
const { version: installedPlaywrightVersion } = require('@playwright/test/package.json') as {
  version: string;
};

/** True when LambdaTest/HyperExecute credentials are present, i.e. tests should run on the cloud grid. */
export function isCloudRun(): boolean {
  return !!process.env.LT_USERNAME && !!process.env.LT_ACCESS_KEY;
}

/**
 * Capabilities as produced by the LambdaTest capabilities generator for Playwright.
 * network / video / console / visual enable network logs, video recording, console logs and screenshots.
 */
export function getCapabilities(platform: CloudPlatform) {
  return {
    browserName: 'Chrome',
    browserVersion: process.env.BROWSER_VERSION || 'latest',
    'LT:Options': {
      platform,
      build: process.env.BUILD_NAME || 'Playwright-102-Build',
      name: `Playwright 102 - ${platform} Chrome`,
      project: 'Playwright-102-TestMUAI',
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      network: process.env.ENABLE_NETWORK_LOGS !== 'false',
      video: process.env.ENABLE_VIDEO !== 'false',
      console: process.env.ENABLE_CONSOLE_LOGS !== 'false',
      visual: process.env.ENABLE_SCREENSHOTS !== 'false',
      terminal: true,
      w3c: true,
      playwrightClientVersion: process.env.PW_CLIENT_VERSION || installedPlaywrightVersion,
    },
  };
}

export function getWsEndpoint(platform: CloudPlatform): string {
  const caps = encodeURIComponent(JSON.stringify(getCapabilities(platform)));
  return `wss://cdp.lambdatest.com/playwright?capabilities=${caps}`;
}
