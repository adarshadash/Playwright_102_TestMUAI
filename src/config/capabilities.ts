export function getLambdaTestCapabilities() {
  const platform = process.env.PLATFORM || 'Windows 10';
  const browserVersion = process.env.BROWSER_VERSION || 'latest';
  const buildName = process.env.BUILD_NAME || `Playwright-102-Build-${Date.now()}`;

  const ltOptions = {
    platform: platform,
    browserName: 'Chrome',
    browserVersion: browserVersion,
    'LT:Options': {
      username: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      build: buildName,
      name: `${platform}-${browserVersion}`,
      project: 'Playwright-102-TestMUAI',
      w3c: true,
      network: true,
      video: true,
      console: true,
      visual: true,
    },
  };

  return ltOptions;
}

export function isLocalRun(): boolean {
  return !process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY;
}
