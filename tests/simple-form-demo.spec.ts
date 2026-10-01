import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test.describe('Simple Form Demo Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.clickSimpleFormDemo();
  });

  test('should validate URL contains simple-form-demo', async ({ page }) => {
    expect(page.url()).toContain('simple-form-demo');
  });

  test.describe('Enter message and validate display', () => {
    for (const message of testData.simpleFormDemo.messages) {
      test(`should enter message "${message}" and validate it displays`, async ({ simpleFormPage }) => {
        // Enter message
        await simpleFormPage.enterMessage(message);

        // Click Get Checked Value
        await simpleFormPage.clickGetCheckedValue();

        // Validate displayed message
        const displayedMessage = await simpleFormPage.getDisplayedMessage();
        expect(displayedMessage).toBe(message);
      });
    }
  });

  test('should validate simple form demo page loads correctly', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();

    const messageInput = page.locator('input[id="user-message"]');
    await expect(messageInput).toBeVisible();
  });
});
