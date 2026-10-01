import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test.describe('Drag & Drop Sliders Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.clickDragDropSliders();
  });

  test('should set slider value from 15 to 95 and validate', async ({ sliderPage }) => {
    const { targetValue } = testData.dragDropSliders;

    // Set slider value
    await sliderPage.setSliderValue(targetValue);

    // Validate range value
    const rangeValue = await sliderPage.getRangeValue();
    expect(rangeValue).toBe(targetValue.toString());
  });

  test('should verify slider default value is 15', async ({ sliderPage }) => {
    const { defaultValue } = testData.dragDropSliders;

    const rangeValue = await sliderPage.getRangeValue();
    expect(rangeValue).toBe(defaultValue.toString());
  });

  test('should validate slider is within valid range', async ({ page }) => {
    const slider = page.locator('input[type="range"][min="0"][max="100"]').first();

    const minValue = await slider.getAttribute('min');
    const maxValue = await slider.getAttribute('max');

    expect(minValue).toBe('0');
    expect(maxValue).toBe('100');
  });
});
