import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimpleFormDemoPage extends BasePage {
  readonly messageInput: Locator;
  readonly getCheckedValueButton: Locator;
  readonly displayedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.messageInput = page.getByPlaceholder('Please enter your Message');
    this.getCheckedValueButton = page.getByRole('button', { name: 'Get Checked Value' });
    this.displayedMessage = page.locator('#user-message #message');
  }

  async enterMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
  }

  async clickGetCheckedValue(): Promise<void> {
    await this.getCheckedValueButton.click();
  }
}
