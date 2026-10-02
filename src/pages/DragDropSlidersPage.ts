import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropSlidersPage extends BasePage {
  readonly sliderInput = 'input[type="range"]';

  constructor(page: Page) {
    super(page);
  }

  async setSliderValue(targetValue: number): Promise<void> {
    // Set via evaluate (direct DOM manipulation)
    const value = await this.page.evaluate((val: number) => {
      const sliderElement = document.querySelector('input[type="range"]') as HTMLInputElement;
      if (sliderElement) {
        sliderElement.value = val.toString();
        sliderElement.dispatchEvent(new Event('input', { bubbles: true }));
        sliderElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return sliderElement?.value || null;
    }, targetValue);

    await this.page.waitForTimeout(500);
  }

  async getRangeValue(): Promise<string | null> {
    return await this.page.evaluate(() => {
      // Look for the range output element - could be a span, div, or any element with the value
      const rangeElements = Array.from(document.querySelectorAll('*')).filter((el: Element) => {
        const text = el.textContent?.trim();
        return text && /^\d+$/.test(text) && el.children.length === 0;
      });

      // Find the one closest to the slider
      const slider = document.querySelector('input[type="range"]');
      if (!slider || rangeElements.length === 0) return null;

      // Get the first small element with just a number (likely the range output)
      return rangeElements[rangeElements.length - 1]?.textContent || null;
    });
  }

  async verifyRangeValue(expectedValue: number): Promise<boolean> {
    const value = await this.getRangeValue();
    return value === expectedValue.toString();
  }
}
