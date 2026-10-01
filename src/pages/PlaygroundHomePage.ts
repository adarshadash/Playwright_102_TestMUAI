import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlaygroundHomePage extends BasePage {
  readonly baseUrl = 'https://www.testmuai.com/selenium-playground/';

  readonly simpleFormDemoLink = 'a[href*="simple-form-demo"]';
  readonly dragDropSlidersLink = 'a[href*="drag-drop-range-sliders"]';
  readonly inputFormSubmitLink = 'a[href*="input-form-demo"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.goto(this.baseUrl);
    await this.waitForLoadState('load');
  }

  async clickSimpleFormDemo(): Promise<void> {
    await this.click(this.simpleFormDemoLink);
    await this.waitForLoadState('load');
  }

  async clickDragDropSliders(): Promise<void> {
    await this.click(this.dragDropSlidersLink);
    await this.waitForLoadState('load');
  }

  async clickInputFormSubmit(): Promise<void> {
    await this.click(this.inputFormSubmitLink);
    await this.waitForLoadState('load');
  }
}
