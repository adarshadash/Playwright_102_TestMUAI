import { test, expect } from '@fixtures/test-fixtures';
import { testData } from '@data/testData';

const { requiredFieldMessage, successMessage, validUser } = testData.inputFormSubmit;

test.describe('Scenario 3 - Input Form Submit', () => {
  test('empty submit shows required error, valid submit shows success message', async ({ homePage, inputFormPage }) => {
    await homePage.navigate();
    await homePage.openInputFormSubmit();

    await inputFormPage.clickSubmit();
    expect(await inputFormPage.validationMessageOf(inputFormPage.nameInput)).toMatch(requiredFieldMessage);

    await inputFormPage.fillForm(validUser);
    await expect(inputFormPage.countrySelect.locator('option:checked')).toHaveText(validUser.country);
    await inputFormPage.clickSubmit();

    await expect(inputFormPage.successMessage(successMessage)).toBeVisible();
  });
});
