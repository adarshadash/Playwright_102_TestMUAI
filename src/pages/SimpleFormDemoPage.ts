import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SimpleFormDemoPage extends BasePage {
  readonly messageInput = 'input[type="text"][placeholder*="Please enter your Message"]';
  readonly getCheckedValueButton = 'button:has-text("Get Checked Value")';

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
    // Get the message that appears after clicking "Get Checked Value"
    // It's displayed after the "Your Message:" label in a sibling element
    const message = await this.page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const yourMessageLabel = labels.find(l => l.textContent?.includes('Your Message'));

      if (!yourMessageLabel) return null;

      // Find the next element or sibling that contains the message
      let parent = yourMessageLabel.parentElement;
      if (!parent) return null;

      // Look for any element after the label in the parent
      const allChildren = Array.from(parent.children);
      const labelIndex = allChildren.indexOf(yourMessageLabel);

      // Return content of next sibling or look for a div after the label
      for (let i = labelIndex + 1; i < allChildren.length; i++) {
        const content = allChildren[i].textContent?.trim();
        if (content && content.length > 0) {
          return content;
        }
      }

      return null;
    });

    return message;
  }
}
