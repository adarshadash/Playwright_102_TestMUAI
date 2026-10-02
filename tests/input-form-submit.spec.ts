import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test('Input Form Submit - Complete Test Scenario 3', async ({ homePage, inputFormPage }) => {
  // Step 1: Open the TestMu AI Selenium Playground page
  await homePage.navigate();

  // Step 2: Click "Input Form Submit"
  await homePage.clickInputFormSubmit();

  // Step 3: Click "Submit" without filling in any information in the form
  await inputFormPage.clickSubmit();

  // Step 4: Assert "Please fill in this field." error message
  const validationMessage = await inputFormPage.getValidationMessage('input[name="name"]');
  expect(validationMessage).toBe('Please fill in this field.');

  // Step 5: Fill in Name, Email, and other fields
  const { validUser } = testData.inputFormSubmit;
  await inputFormPage.fillName(validUser.name);
  await inputFormPage.fillEmail(validUser.email);
  await inputFormPage.fillPhone(validUser.phone);
  await inputFormPage.fillAddress(validUser.address);

  // Step 6: From the Country drop-down, select "United States" using the text property
  await inputFormPage.selectCountry(validUser.country);

  // Step 7: Fill in all fields and click "Submit"
  await inputFormPage.clickSubmit();

  // Step 8: Once submitted, validate the success message "Thanks for contacting us, we will get back to you shortly." on the screen
  const successMessage = await inputFormPage.getSuccessMessage();
  expect(successMessage).toContain('Thanks for contacting us, we will get back to you shortly');
});
