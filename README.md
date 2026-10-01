# Playwright 102 - TestMu AI Selenium Playground Tests

Automated test suite for TestMu AI Selenium Playground using Playwright with TypeScript, following the Page Object Model (POM) pattern and best practices.

## Project Overview

This project includes automated tests for three scenarios:

1. **Simple Form Demo** - Test form input and validation
2. **Drag & Drop Sliders** - Test slider interaction and range validation
3. **Input Form Submit** - Test form submission with validation

## Architecture

### Page Object Model (POM)
- `src/pages/BasePage.ts` - Base class with common actions
- `src/pages/PlaygroundHomePage.ts` - Home page interactions
- `src/pages/SimpleFormDemoPage.ts` - Simple form interactions
- `src/pages/DragDropSlidersPage.ts` - Slider interactions
- `src/pages/InputFormSubmitPage.ts` - Form submission interactions

### Test Fixtures & Data
- `src/fixtures/test-fixtures.ts` - Custom test fixtures with page objects
- `src/data/testData.ts` - Parameterized test data
- `src/config/capabilities.ts` - LambdaTest/LT capabilities builder

### Test Suites
- `tests/simple-form-demo.spec.ts` - 4 test cases
- `tests/drag-drop-slider.spec.ts` - 3 test cases
- `tests/input-form-submit.spec.ts` - 3 test cases

## Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd playwright-102-testmuai

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Configuration

### Local Testing
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

For local testing, you can leave LT credentials empty:
```env
BASE_URL=https://www.testmuai.com/selenium-playground/
PLATFORM=Windows 10
BROWSER_VERSION=latest
```

### LambdaTest Cloud Testing
Set your LambdaTest credentials:
```env
LT_USERNAME=your_username
LT_ACCESS_KEY=your_access_key
PLATFORM=Windows 10
BROWSER_VERSION=latest
BUILD_NAME=Playwright-102-Build
```

Get credentials from: https://accounts.lambdatest.com/detail/profile

## Running Tests

### Local Execution
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/simple-form-demo.spec.ts

# Run tests in UI mode
npm run test:ui

# Debug tests
npm run test:debug
```

### LambdaTest Cloud Execution (HyperExecute)

#### Prerequisites
1. LambdaTest account with HyperExecute access
2. HyperExecute CLI installed

#### Setup HyperExecute Secrets
1. Go to HyperExecute Dashboard
2. Navigate to Secrets Management
3. Create secrets:
   - `LT_USERNAME` - Your LambdaTest username
   - `LT_ACCESS_KEY` - Your LambdaTest access key

#### Run via HyperExecute CLI
```bash
# Download HyperExecute CLI
# For Linux:
wget https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute
chmod +x hyperexecute

# For Windows:
# Download from https://downloads.lambdatest.com/hyperexecute/windows/hyperexecute.exe

# Run tests
./hyperexecute --user $LT_USERNAME --key $LT_ACCESS_KEY --config hyperexecute.yaml
```

#### Features Used
- **Parallel Execution**: Tests run on 2 platforms (Windows 10 Chrome, Linux Chrome)
- **Dependency Caching**: npm dependencies cached across runs
- **Environment Variables**: Base URL, Platform, Browser Version injected
- **Artifacts Management**: Test reports, videos, logs uploaded and merged
- **Network Logs**: Enabled via LT capabilities
- **Video Recording**: Enabled for all sessions
- **Screenshots**: Captured on failure
- **Console Logs**: Captured during execution

## HyperExecute Configuration

### Key Features in `hyperexecute.yaml`

1. **Parallel Matrix**
   ```yaml
   matrix:
     os: [win, linux]
   concurrency: 2
   ```

2. **Dependency Caching**
   ```yaml
   cacheKey: '{{ checksum "package-lock.json" }}'
   cacheDirectories:
     - node_modules
   ```

3. **Pre-Steps**
   ```yaml
   pre:
     - npm ci
     - npx playwright install chromium
   ```

4. **Environment Variables**
   ```yaml
   env:
     BASE_URL: https://www.testmuai.com/selenium-playground/
     PLATFORM: ${matrix.os == 'win' ? 'Windows 10' : 'Linux'}
   ```

5. **Artifacts Upload**
   ```yaml
   uploadArtefacts:
     - name: playwright-report
       path:
         - playwright-report/**
         - test-results/**
   ```

## GitHub Actions Integration

Workflow file: `.github/workflows/hyperexecute.yml`

### Triggering the Workflow
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via GitHub Actions UI

### Required Secrets
Add to GitHub repository settings:
- `LT_USERNAME` - LambdaTest username
- `LT_ACCESS_KEY` - LambdaTest access key

### Workflow Steps
1. Checkout code
2. Download HyperExecute CLI
3. Run tests via HyperExecute
4. Upload test artifacts
5. Publish test report (JUnit format)

## Test Scenarios

### Scenario 1: Simple Form Demo
- Navigate to Simple Form Demo page
- Verify URL contains "simple-form-demo"
- Enter test messages from parameterized data
- Click "Get Checked Value"
- Validate displayed message matches input

### Scenario 2: Drag & Drop Sliders
- Navigate to Drag & Drop Sliders page
- Set slider value from 15 to 95
- Validate range display shows 95
- Verify slider min/max range attributes

### Scenario 3: Input Form Submit
- Navigate to Input Form Submit page
- Test validation: submit empty form and check error
- Fill all form fields with parameterized data
- Select "United States" from country dropdown
- Submit form
- Validate success message

## Parameterization

Test data is centralized in `src/data/testData.ts`:

```typescript
export const testData = {
  simpleFormDemo: {
    messages: ['Welcome to TestMu AI', 'Automation Testing', ...],
  },
  dragDropSliders: {
    targetValue: 95,
  },
  inputFormSubmit: {
    validUser: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      ...
    },
  },
};
```

## Capabilities & Logging

### LambdaTest Capabilities Enabled
- `network: true` - Network logs captured
- `video: true` - Video recording of execution
- `console: true` - Console logs captured
- `visual: true` - Screenshots captured

### Local Test Reports
After running tests locally:
```bash
npm run test:report
```

This opens the HTML report at `playwright-report/index.html`

## Troubleshooting

### Tests Not Running Locally
1. Verify Node.js version: `node --version` (should be 18+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Reinstall Playwright: `npx playwright install`

### LambdaTest Connection Issues
1. Verify credentials in `.env` file
2. Check internet connectivity
3. Ensure LambdaTest account has HyperExecute access

### Selector Not Found
1. Run with `--debug` flag to inspect elements
2. Verify selectors against live page in Chrome DevTools
3. Update selectors in corresponding page object class

## Best Practices Implemented

✅ Page Object Model (POM) - Locators centralized in page classes
✅ Parameterization - Test data in separate files
✅ Fixtures - Custom test fixtures for reusable page objects
✅ TypeScript - Full type safety and IDE support
✅ CI/CD Integration - GitHub Actions workflow
✅ Cloud Testing - LambdaTest HyperExecute integration
✅ Artifacts Management - Test reports, videos, logs
✅ Dependency Caching - Faster builds
✅ Environment Variables - Configuration flexibility
✅ Parallel Execution - Multi-platform testing

## Project Structure
```
playwright-102-testmuai/
├── src/
│   ├── pages/               # Page Object classes
│   │   ├── BasePage.ts
│   │   ├── PlaygroundHomePage.ts
│   │   ├── SimpleFormDemoPage.ts
│   │   ├── DragDropSlidersPage.ts
│   │   └── InputFormSubmitPage.ts
│   ├── fixtures/            # Custom test fixtures
│   │   └── test-fixtures.ts
│   ├── data/                # Test data
│   │   └── testData.ts
│   └── config/              # Configuration
│       └── capabilities.ts
├── tests/                   # Test specifications
│   ├── simple-form-demo.spec.ts
│   ├── drag-drop-slider.spec.ts
│   └── input-form-submit.spec.ts
├── .github/
│   └── workflows/
│       └── hyperexecute.yml # GitHub Actions workflow
├── playwright.config.ts     # Playwright configuration
├── hyperexecute.yaml        # HyperExecute configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Contributing

1. Create a feature branch
2. Add tests for new features
3. Ensure all tests pass: `npm test`
4. Commit with clear messages
5. Push to repository
6. Create Pull Request

## License

ISC

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review test logs in playwright-report/
3. Enable debug mode: `npm run test:debug`

## References

- [Playwright Documentation](https://playwright.dev)
- [LambdaTest HyperExecute Docs](https://www.lambdatest.com/support/docs/hyperexecute-getting-started/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
