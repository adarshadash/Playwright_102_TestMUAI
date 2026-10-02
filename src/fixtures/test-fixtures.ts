import { test as base } from '@playwright/test';
import { PlaygroundHomePage } from '../pages/PlaygroundHomePage';
import { SimpleFormDemoPage } from '../pages/SimpleFormDemoPage';
import { DragDropSlidersPage } from '../pages/DragDropSlidersPage';
import { InputFormSubmitPage } from '../pages/InputFormSubmitPage';
import { isCloudRun } from '../config/capabilities';

type TestFixtures = {
  homePage: PlaygroundHomePage;
  simpleFormPage: SimpleFormDemoPage;
  sliderPage: DragDropSlidersPage;
  inputFormPage: InputFormSubmitPage;
  reportCloudStatus: void;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => use(new PlaygroundHomePage(page)),
  simpleFormPage: async ({ page }, use) => use(new SimpleFormDemoPage(page)),
  sliderPage: async ({ page }, use) => use(new DragDropSlidersPage(page)),
  inputFormPage: async ({ page }, use) => use(new InputFormSubmitPage(page)),

  // Marks the session passed/failed on the LambdaTest dashboard.
  reportCloudStatus: [
    async ({ page }, use, testInfo) => {
      await use();
      if (!isCloudRun()) return;
      const status = testInfo.status === testInfo.expectedStatus ? 'passed' : 'failed';
      const action = { action: 'setTestStatus', arguments: { status, remark: testInfo.error?.message ?? status } };
      await page.evaluate(() => {}, `lambdatest_action: ${JSON.stringify(action)}`).catch(() => undefined);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
