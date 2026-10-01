import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimpleFormDemoPage extends BasePage {
  readonly messageInput = 'input[type="text"][placeholder*="Please enter your Message"]';
  readonly getCheckedValueButton = 'button:has-text("Get Checked Value")';
  readonly yourMessagePanel = 'label:has-text("Your Message:") + *';

  constructor(page: Page) {
    super(page);
  }

  async enterMessage(message: string): Promise<void> {
    await this.fill(this.messageInput, message);
  }

  async clickGetCheckedValue(): Promise<void> {
    await this.click(this.getCheckedValueButton);
    await this.page.waitForTimeout(500);
  }

  async getDisplayedMessage(): Promise<string | null> {
    return await this.getText(this.yourMessagePanel);
  }
}
