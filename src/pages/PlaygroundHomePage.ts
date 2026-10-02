import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlaygroundHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.goto('');
  }

  /** Clicks a demo link on the playground home page by its visible text. */
  async openDemo(linkText: string): Promise<void> {
    await this.page.getByRole('link', { name: linkText, exact: true }).click();
  }

  async openSimpleFormDemo(): Promise<void> {
    await this.openDemo('Simple Form Demo');
  }

  async openDragDropSliders(): Promise<void> {
    await this.openDemo('Drag & Drop Sliders');
  }

  async openInputFormSubmit(): Promise<void> {
    await this.openDemo('Input Form Submit');
  }
}
