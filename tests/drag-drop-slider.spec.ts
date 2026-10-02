import { test, expect } from '../src/fixtures/test-fixtures';
import { testData } from '../src/data/testData';

test('Drag & Drop Sliders - Complete Test Scenario 2', async ({ page, homePage, sliderPage }) => {
  // Step 1: Open the TestMu AI Selenium Playground page
  await homePage.navigate();

  // Step 2: Click "Drag & Drop Sliders"
  await homePage.clickDragDropSliders();

  // Step 3: Validate slider exists and has correct range
  const slider = page.locator('input[type="range"][min="0"][max="100"]').first();
  const minValue = await slider.getAttribute('min');
  const maxValue = await slider.getAttribute('max');
  expect(minValue).toBe('0');
  expect(maxValue).toBe('100');

  // Step 4: Verify slider default value is 15
  const { defaultValue, targetValue } = testData.dragDropSliders;
  const initialRangeValue = await sliderPage.getRangeValue();
  expect(initialRangeValue).toBe(defaultValue.toString());

  // Step 5: Select the slider "Default value 15" and drag the bar to make it 95
  await sliderPage.setSliderValue(targetValue);

  // Step 6: Validate whether the range value shows 95
  const rangeValue = await sliderPage.getRangeValue();
  expect(rangeValue).toBe(targetValue.toString());
});
