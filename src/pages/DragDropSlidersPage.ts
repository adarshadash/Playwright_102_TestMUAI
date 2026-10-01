import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropSlidersPage extends BasePage {
  readonly sliderInput = 'input[type="range"][min="0"][max="100"]';
  readonly rangeOutput = '#range';

  constructor(page: Page) {
    super(page);
  }

  async setSliderValue(targetValue: number): Promise<void> {
    // Set via evaluate (direct DOM manipulation)
    await this.page.evaluate((value: number) => {
      const sliderElement = document.querySelector('input[type="range"][min="0"][max="100"]') as HTMLInputElement;
      if (sliderElement) {
        sliderElement.value = value.toString();
        sliderElement.dispatchEvent(new Event('input', { bubbles: true }));
        sliderElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, targetValue);

    await this.page.waitForTimeout(500);
  }

  async getRangeValue(): Promise<string | null> {
    return await this.getText(this.rangeOutput);
  }

  async verifyRangeValue(expectedValue: number): Promise<boolean> {
    const value = await this.getRangeValue();
    return value === expectedValue.toString();
  }
}
