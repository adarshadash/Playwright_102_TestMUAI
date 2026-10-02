import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test('Simple Form Demo - Complete Test Scenario 1', async ({ page, homePage, simpleFormPage }) => {
  // Step 1: Open TestMu AI Selenium Playground and click Simple Form Demo
  await homePage.navigate();
  await homePage.clickSimpleFormDemo();

  // Step 2: Validate that the URL contains "simple-form-demo"
  expect(page.url()).toContain('simple-form-demo');

  // Step 3: Create a variable for a string value
  const testMessage = testData.simpleFormDemo.messages[0]; // "Welcome to TestMu AI"

  // Step 4: Use this variable to enter values in the "Enter Message" text box
  await simpleFormPage.enterMessage(testMessage);

  // Step 5: Click "Get Checked Value"
  await simpleFormPage.clickGetCheckedValue();

  // Step 6: Validate whether the same text message is displayed in the right-hand panel under the "Your Message:" section
  const displayedMessage = await simpleFormPage.getDisplayedMessage();
  expect(displayedMessage).toBe(testMessage);
});
