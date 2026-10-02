import { test, expect } from '@fixtures/test-fixtures';
import { testData } from '@data/testData';

const { urlFragment, messages } = testData.simpleFormDemo;

test.describe('Scenario 1 - Simple Form Demo', () => {
  for (const message of messages) {
    test(`message "${message}" is echoed under "Your Message:"`, async ({ page, homePage, simpleFormPage }) => {
      await homePage.navigate();
      await homePage.openSimpleFormDemo();
      await expect(page).toHaveURL(new RegExp(urlFragment));

      await simpleFormPage.enterMessage(message);
      await simpleFormPage.clickGetCheckedValue();

      await expect(simpleFormPage.displayedMessage).toHaveText(message);
    });
  }
});
