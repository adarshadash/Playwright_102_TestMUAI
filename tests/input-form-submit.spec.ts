import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test.describe('Input Form Submit Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.clickInputFormSubmit();
  });

  test('should show validation error when submitting empty form', async ({ inputFormPage }) => {
    // Click submit without filling any fields
    await inputFormPage.clickSubmit();

    // Check for validation message (browser native validation)
    const validationMessage = await inputFormPage.getValidationMessage('input[name="name"]');

    expect(validationMessage).toBe('Please fill in this field.');
  });

  test('should fill form and submit successfully', async ({ inputFormPage }) => {
    const { validUser } = testData.inputFormSubmit;

    // Fill all form fields
    await inputFormPage.fillName(validUser.name);
    await inputFormPage.fillEmail(validUser.email);
    await inputFormPage.fillPhone(validUser.phone);
    await inputFormPage.fillAddress(validUser.address);
    await inputFormPage.selectCountry(validUser.country);

    // Submit form
    await inputFormPage.clickSubmit();

    // Validate success message
    const successMessage = await inputFormPage.getSuccessMessage();
    expect(successMessage).toContain('Thanks for contacting us, we will get back to you shortly');
  });

  test('should fill form with alternative data and submit', async ({ inputFormPage }) => {
    // Alternative test data
    const altData = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '9876543210',
      address: '456 Oak Avenue, Portland, USA',
      country: 'United States',
    };

    // Fill form
    await inputFormPage.fillName(altData.name);
    await inputFormPage.fillEmail(altData.email);
    await inputFormPage.fillPhone(altData.phone);
    await inputFormPage.fillAddress(altData.address);
    await inputFormPage.selectCountry(altData.country);

    // Submit
    await inputFormPage.clickSubmit();

    // Validate success
    const successMessage = await inputFormPage.getSuccessMessage();
    expect(successMessage).toContain('Thanks for contacting us');
  });
});
