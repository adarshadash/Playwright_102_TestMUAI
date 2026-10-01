import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InputFormSubmitPage extends BasePage {
  readonly nameInput = 'input[name="name"]';
  readonly emailInput = 'input[name="email"]';
  readonly phoneInput = 'input[name="phone"]';
  readonly addressInput = 'textarea[name="address"]';
  readonly countrySelect = 'select[name="country"]';
  readonly submitButton = 'button:has-text("Submit")';
  readonly successMessage = 'p.success-message, .success-message, div:has-text("Thanks for contacting us")';

  constructor(page: Page) {
    super(page);
  }

  async fillName(name: string): Promise<void> {
    await this.fill(this.nameInput, name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.fill(this.phoneInput, phone);
  }

  async fillAddress(address: string): Promise<void> {
    await this.fill(this.addressInput, address);
  }

  async selectCountry(countryLabel: string): Promise<void> {
    await this.selectOption(this.countrySelect, { label: countryLabel });
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
    await this.page.waitForTimeout(1000);
  }

  async getValidationMessage(fieldSelector: string): Promise<string> {
    const field = this.page.locator(fieldSelector).first();
    const validationMessage = await field.evaluate((el: any) => el.validationMessage);
    return validationMessage;
  }

  async getSuccessMessage(): Promise<string | null> {
    // Try multiple possible selectors for success message
    const selector = await this.page.evaluate(() => {
      const selectors = [
        'p.success-message',
        '.success-message',
        'p:has-text("Thanks for contacting")',
        '[class*="success"]',
      ];

      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent?.includes('Thanks for contacting')) {
          return el.textContent;
        }
      }

      // Fallback: find any element containing the success message text
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        if (el.textContent?.includes('Thanks for contacting us, we will get back to you shortly')) {
          return el.textContent;
        }
      }
      return null;
    });

    return selector;
  }
}
