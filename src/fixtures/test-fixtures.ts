import { test as base, Page } from '@playwright/test';
import { PlaygroundHomePage } from '@pages/PlaygroundHomePage';
import { SimpleFormDemoPage } from '@pages/SimpleFormDemoPage';
import { DragDropSlidersPage } from '@pages/DragDropSlidersPage';
import { InputFormSubmitPage } from '@pages/InputFormSubmitPage';

type TestFixtures = {
  homePage: PlaygroundHomePage;
  simpleFormPage: SimpleFormDemoPage;
  sliderPage: DragDropSlidersPage;
  inputFormPage: InputFormSubmitPage;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new PlaygroundHomePage(page);
    await use(homePage);
  },

  simpleFormPage: async ({ page }, use) => {
    const simpleFormPage = new SimpleFormDemoPage(page);
    await use(simpleFormPage);
  },

  sliderPage: async ({ page }, use) => {
    const sliderPage = new DragDropSlidersPage(page);
    await use(sliderPage);
  },

  inputFormPage: async ({ page }, use) => {
    const inputFormPage = new InputFormSubmitPage(page);
    await use(inputFormPage);
  },
});

export { expect } from '@playwright/test';
