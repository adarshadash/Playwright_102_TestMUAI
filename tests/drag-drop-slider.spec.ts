import { test, expect } from '@fixtures/test-fixtures';
import { testData } from '@data/testData';

const { sliderLabel, defaultValue, targetValue } = testData.dragDropSliders;

test.describe('Scenario 2 - Drag & Drop Sliders', () => {
  test(`drag "${sliderLabel}" slider to ${targetValue}`, async ({ homePage, sliderPage }) => {
    await homePage.navigate();
    await homePage.openDragDropSliders();

    await expect(sliderPage.slider(sliderLabel)).toHaveValue(String(defaultValue));
    await expect(sliderPage.rangeValue(sliderLabel)).toHaveText(String(defaultValue));

    await sliderPage.dragSliderTo(sliderLabel, targetValue);

    await expect(sliderPage.slider(sliderLabel)).toHaveValue(String(targetValue));
    await expect(sliderPage.rangeValue(sliderLabel)).toHaveText(String(targetValue));
  });
});
