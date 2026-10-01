import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.click(selector);
    } else {
      await selector.click();
    }
  }

  async fill(selector: string | Locator, value: string): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.fill(selector, value);
    } else {
      await selector.fill(value);
    }
  }

  async selectOption(selector: string | Locator, value: string | { label?: string; value?: string }): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.selectOption(selector, value);
    } else {
      await selector.selectOption(value);
    }
  }

  async getText(selector: string | Locator): Promise<string | null> {
    if (typeof selector === 'string') {
      return await this.page.textContent(selector);
    } else {
      return await selector.textContent();
    }
  }

  async getInputValue(selector: string | Locator): Promise<string | null> {
    if (typeof selector === 'string') {
      return await this.page.inputValue(selector);
    } else {
      return await selector.inputValue();
    }
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  async waitForSelector(selector: string, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForSelector(selector, options);
  }
}
