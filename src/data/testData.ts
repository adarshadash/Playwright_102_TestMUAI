export const testData = {
  simpleFormDemo: {
    urlFragment: 'simple-form-demo',
    messages: ['Welcome to TestMu AI', 'Automation Testing', 'Page Object Model'],
  },
  dragDropSliders: {
    sliderLabel: 'Default value 15',
    defaultValue: 15,
    targetValue: 95,
  },
  inputFormSubmit: {
    // Chromium says "fill out", Firefox says "fill in"; both are the native required-field message.
    requiredFieldMessage: /^Please fill (in|out) this field\.$/,
    successMessage: 'Thanks for contacting us, we will get back to you shortly.',
    validUser: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Passw0rd!123',
      company: 'TestMu AI',
      website: 'https://www.testmuai.com',
      country: 'United States',
      city: 'San Jose',
      address1: '123 Main Street',
      address2: 'Suite 100',
      state: 'California',
      zip: '95101',
    },
  },
};
