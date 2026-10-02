import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropSlidersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private heading(label: string): Locator {
    return this.page.getByRole('heading', { name: label, exact: true });
  }

  /** The range input that follows the heading, e.g. "Default value 15". */
  slider(label: string): Locator {
    return this.heading(label).locator('xpath=following::input[@type="range"][1]');
  }

  /** The <output> element showing the value of the slider under the given heading. */
  rangeValue(label: string): Locator {
    return this.heading(label).locator('xpath=following::output[1]');
  }

  /** Drags the slider thumb with the mouse to `target`, then corrects the exact value if the drag fell short. */
  async dragSliderTo(label: string, target: number): Promise<void> {
    const slider = this.slider(label);
    await slider.scrollIntoViewIfNeeded();
    const box = await slider.boundingBox();
    if (!box) throw new Error(`Slider "${label}" is not visible`);

    const min = Number(await slider.getAttribute('min'));
    const max = Number(await slider.getAttribute('max'));
    const current = Number(await slider.inputValue());

    const xFor = (v: number) => box.x + ((v - min) / (max - min)) * box.width;
    const y = box.y + box.height / 2;

    await this.page.mouse.move(xFor(current), y);
    await this.page.mouse.down();
    await this.page.mouse.move(xFor(target), y, { steps: 20 });
    await this.page.mouse.up();

    // Remote browsers can under-register the drag; set the exact value (fires input/change) if it landed short.
    if (Number(await slider.inputValue()) !== target) {
      await slider.fill(String(target));
    }
  }
}
