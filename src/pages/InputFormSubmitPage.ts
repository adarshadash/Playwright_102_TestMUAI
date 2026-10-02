import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface InputFormData {
  name: string;
  email: string;
  password: string;
  company: string;
  website: string;
  country: string;
  city: string;
  address1: string;
  address2: string;
  state: string;
  zip: string;
}

export class InputFormSubmitPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly companyInput: Locator;
  readonly websiteInput: Locator;
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // Scope to the demo form: the footer has its own inputs with the same names.
    const form = page.locator('form').filter({ has: page.locator('select[name="country"]') });
    this.nameInput = form.locator('input[name="name"]');
    this.emailInput = form.locator('input[name="email"]');
    this.passwordInput = form.locator('input[name="password"]');
    this.companyInput = form.locator('input[name="company"]');
    this.websiteInput = form.locator('input[name="website"]');
    this.countrySelect = form.locator('select[name="country"]');
    this.cityInput = form.locator('input[name="city"]');
    this.address1Input = form.locator('input[name="address_line1"]');
    this.address2Input = form.locator('input[name="address_line2"]');
    this.stateInput = form.locator('#inputState');
    this.zipInput = form.locator('input[name="zip"]');
    this.submitButton = form.getByRole('button', { name: 'Submit' });
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Native HTML5 validation message of a field. */
  async validationMessageOf(field: Locator): Promise<string> {
    return field.evaluate((el) => (el as HTMLInputElement).validationMessage);
  }

  async selectCountry(countryText: string): Promise<void> {
    await this.countrySelect.selectOption({ label: countryText });
  }

  async fillForm(data: InputFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.companyInput.fill(data.company);
    await this.websiteInput.fill(data.website);
    await this.selectCountry(data.country);
    await this.cityInput.fill(data.city);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
  }

  successMessage(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }
}
