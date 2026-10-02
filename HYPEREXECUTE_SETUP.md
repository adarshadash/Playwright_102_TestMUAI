# HyperExecute Setup Guide - Playwright 102 TestMUAI

Complete guide for setting up and running Playwright tests on LambdaTest HyperExecute with advanced features.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [HyperExecute Features](#hyperexecute-features)
4. [Local Setup](#local-setup)
5. [Environment Variables](#environment-variables)
6. [Secret Management](#secret-management)
7. [Running Tests](#running-tests)
8. [Artifacts Management](#artifacts-management)
9. [GitHub Actions Integration](#github-actions-integration)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project demonstrates a professional test automation framework using Playwright with HyperExecute cloud grid execution. The setup includes:

- **Multiple Test Scenarios**: 3 independent test scenarios segregated into separate test files
- **Page Object Model (POM)**: Reusable page objects following best practices
- **Parameterized Tests**: Centralized test data for easy maintenance
- **Parallel Execution**: Run tests across multiple browser/OS combinations simultaneously
- **Artifacts Management**: Automatic collection and storage of reports, videos, screenshots
- **Secret Management**: Secure handling of sensitive credentials
- **Environment Variables**: Flexible configuration via environment variables
- **CI/CD Integration**: GitHub Actions workflow for automated testing
- **Logging & Monitoring**: Network logs, console logs, video recording, screenshots enabled

---

## 📦 Prerequisites

### Local Development
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**: Latest version
- **Playwright**: Installed via npm

### HyperExecute Cloud
- **LambdaTest Account**: Active account with HyperExecute access
- **LambdaTest Credentials**: Username and Access Key
- **Git Repository**: Your project hosted on GitHub

### GitHub Actions
- **GitHub Repository**: With Actions enabled
- **GitHub Secrets**: Configured for LambdaTest credentials

---

## 🚀 HyperExecute Features Used

### 1. **Artifacts Management**
Automatic collection and download of test execution artifacts:
- HTML test reports
- Test result JSON/XML files
- Video recordings (on failure)
- Screenshots (on failure)
- Console logs
- Network request/response logs

**Location in YAML**: `uploadArtefacts` section

```yaml
uploadArtefacts:
  - name: playwright-reports
    path:
      - playwright-report/**
      - test-results/**
```

### 2. **Secret Management**
Secure handling of sensitive credentials without exposing them in code:
- Database passwords
- API tokens
- Authentication credentials
- Webhook URLs

**Reference in YAML**:
```yaml
secrets:
  - TESTMUAI_USERNAME
  - TESTMUAI_PASSWORD
  - API_TOKEN
  - SLACK_WEBHOOK_URL
```

**Usage in tests**: `${{ secrets.SECRET_NAME }}`

### 3. **Environment Variables Injection**
Configure test behavior from outside the application:
- Test URLs
- Browser preferences
- Logging levels
- Feature flags

**In YAML**:
```yaml
env:
  BASE_URL: ${BASE_URL:https://www.testmuai.com/selenium-playground/}
  HEADLESS: ${HEADLESS:true}
  LOG_LEVEL: ${LOG_LEVEL:info}
```

**Usage in code**: `process.env.BASE_URL`

### 4. **Pre-Steps with Dependency Caching**
Commands executed before test run with optimized dependency caching:

```yaml
pre:
  - npm ci  # Install dependencies
  - npx playwright install chromium  # Install browsers
  - mkdir -p test-results  # Create directories
```

**Cache Configuration**:
```yaml
cacheKey: '{{ checksum "package-lock.json" }}'
cacheDirectories:
  - node_modules
```

### 5. **Post-Steps**
Commands executed after test execution:
- Generate reports
- Archive artifacts
- Send notifications
- Cleanup resources

```yaml
post:
  - echo "Test execution completed"
  - zip -r test-artifacts.zip test-results/ playwright-report/
```

### 6. **Desired Capabilities**
Configure browser with logging features enabled:

```yaml
desiredCapabilities:
  platformName: ${PLATFORM}
  browserName: ${matrix.browser}
  browserVersion: ${BROWSER_VERSION}
```

**Logging Features Enabled**:
- Network logging (request/response capture)
- Video recording
- Screenshot capture
- Console logging

---

## 🛠️ Local Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Playwright_102_TestMUAI
```

### 2. Install Dependencies
```bash
npm install
# or using the setup script
npm run setup
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Configure Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your configuration
# BASE_URL=https://www.testmuai.com/selenium-playground/
# HEADLESS=true
# LOG_LEVEL=info
```

### 5. Verify Setup
```bash
# Run tests locally
npm test

# Run tests with UI
npm run test:ui

# Run specific scenario
npm run test:scenario1
```

---

## 🔐 Environment Variables

### Available Variables

| Variable | Default | Description | Example |
|----------|---------|-------------|---------|
| `BASE_URL` | https://www.testmuai.com/selenium-playground/ | Application URL | https://www.testmuai.com/selenium-playground/ |
| `HEADLESS` | true | Run in headless mode | true/false |
| `CI` | false | CI/CD environment flag | true |
| `LOG_LEVEL` | info | Logging verbosity | info, debug, warn, error |
| `ENABLE_VIDEO` | true | Record test videos | true/false |
| `ENABLE_SCREENSHOTS` | true | Capture screenshots | true/false |
| `ENABLE_CONSOLE_LOGS` | true | Log console output | true/false |
| `ENABLE_NETWORK_LOGS` | true | Log network requests | true/false |
| `EXECUTION_ENV` | local | Execution environment | local, hyperexecute, ci |
| `PLATFORM` | Windows 10 | Target platform | Windows 10, Ubuntu Linux |
| `BROWSER_VERSION` | latest | Browser version | latest, 120, 121, etc. |

### Setting Environment Variables

#### Locally
```bash
# Option 1: .env file
BASE_URL=https://www.testmuai.com/selenium-playground/
HEADLESS=true

# Option 2: Command line
export BASE_URL=https://www.testmuai.com/selenium-playground/
npm test

# Option 3: Inline
BASE_URL=https://www.testmuai.com/selenium-playground/ npm test
```

#### HyperExecute YAML
```yaml
env:
  BASE_URL: ${BASE_URL:https://www.testmuai.com/selenium-playground/}
  HEADLESS: ${HEADLESS:true}
```

#### GitHub Actions
```yaml
env:
  BASE_URL: https://www.testmuai.com/selenium-playground/
  HEADLESS: true
```

---

## 🔑 Secret Management

### Setup HyperExecute Secrets

#### 1. Via LambdaTest Dashboard
1. Go to HyperExecute → Secrets
2. Click "Add Secret"
3. Enter secret name and value
4. Click Save

#### Supported Secrets
- `TESTMUAI_USERNAME` - Application username
- `TESTMUAI_PASSWORD` - Application password
- `API_TOKEN` - API authentication token
- `SLACK_WEBHOOK_URL` - Slack notification webhook
- `HE_ACCESS_KEY` - HyperExecute access key
- `HE_USER_ID` - HyperExecute user ID

#### 2. Reference in YAML
```yaml
secrets:
  - TESTMUAI_USERNAME
  - TESTMUAI_PASSWORD
```

#### 3. Use in Tests (if needed)
```typescript
const username = process.env.TESTMUAI_USERNAME;
const password = process.env.TESTMUAI_PASSWORD;
```

### GitHub Actions Secrets

#### 1. Add Secrets to Repository
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secrets:
   - `LT_USERNAME`
   - `LT_ACCESS_KEY`
   - `SLACK_WEBHOOK_URL`

#### 2. Reference in Workflow
```yaml
env:
  LT_USERNAME: ${{ secrets.LT_USERNAME }}
  LT_ACCESS_KEY: ${{ secrets.LT_ACCESS_KEY }}
```

---

## ▶️ Running Tests

### Local Execution

#### Run All Tests
```bash
npm test
```

#### Run Specific Scenario
```bash
npm run test:scenario1  # Simple Form Demo
npm run test:scenario2  # Drag Drop Slider
npm run test:scenario3  # Input Form Submit
```

#### Run with Different Browsers
```bash
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:webkit    # WebKit only
```

#### Run in Headed Mode
```bash
npm run test:headed
```

#### Run in Debug Mode
```bash
npm run test:debug
```

#### Run in Parallel
```bash
npm run test:parallel
```

### HyperExecute Execution

#### Option 1: Via CLI
```bash
# Install HyperExecute CLI
wget https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute
chmod +x hyperexecute

# Run tests
./hyperexecute --user <username> --key <access_key> --config hyperexecute.yaml
```

#### Option 2: Via LambdaTest Dashboard
1. Go to HyperExecute
2. Click "Run New Job"
3. Select your repository
4. Choose branch
5. Click "Start Execution"

#### Option 3: Via GitHub Actions
```bash
# Push to main/develop/master branch to trigger workflow
git push origin feature-branch
```

### Matrix Execution (Multiple Combinations)

Tests run on:
- Windows 10 + Chromium
- Ubuntu Linux + Chromium
- (Firefox excluded for Linux per configuration)

---

## 📦 Artifacts Management

### What Gets Collected

1. **Test Reports**
   - HTML Report (playwright-report/)
   - JSON Results (test-results/results.json)
   - JUnit XML (test-results/junit.xml)

2. **Media Files**
   - Videos (test-results/videos/) - on failure only
   - Screenshots (test-results/screenshots/) - on failure only

3. **Logs**
   - Console output (captured via reporter)
   - Network requests/responses
   - Browser logs

### Accessing Artifacts

#### From HyperExecute Dashboard
1. Go to your test execution
2. Click "Artifacts" tab
3. Download individual files or full archive

#### From GitHub Actions
1. Go to your workflow run
2. Scroll to "Artifacts" section
3. Click download button

#### Local Storage
```bash
# After local test run
ls -la playwright-report/
ls -la test-results/
ls -la test-results/videos/
ls -la test-results/screenshots/
```

### Report Viewing

#### HTML Report
```bash
npm run test:report
# Opens interactive HTML report in browser
```

#### Console Output
```bash
# View test-results/junit.xml in text editor
# Or import into CI/CD reporting tools
```

---

## 🔄 GitHub Actions Integration

### Workflow Trigger Events

The workflow automatically triggers on:
- **Push** to `main`, `develop`, `master` branches
- **Pull Requests** to `main`, `develop`, `master` branches
- **Schedule**: Daily at 2:00 AM UTC (optional)
- **Manual**: Via workflow_dispatch (click Run workflow in GitHub)

### Workflow Structure

```
setup (Validation)
  ↓
hyperexecute (Parallel: Windows+Chrome, Linux+Chrome, etc.)
  ├── Install Dependencies
  ├── Run Tests
  ├── Upload Artifacts
  └── Publish Reports
  ↓
results (Summary & Notifications)
  ├── Generate Summary
  └── Slack Notification
```

### Viewing Results

#### In GitHub Actions
1. Go to Actions tab
2. Select latest workflow run
3. View job logs and artifacts

#### In GitHub Checks
- On PR, view "Checks" tab
- See individual test results
- Click "Show details" for full report

#### In Slack (if configured)
- Notifications sent on test completion
- Link to artifacts and detailed reports

---

## 📚 Test Structure

### Test Scenarios

**Scenario 1: Simple Form Demo** (`tests/simple-form-demo.spec.ts`)
- Open TestMu AI Selenium Playground
- Click "Simple Form Demo"
- Validate URL contains "simple-form-demo"
- Enter message and validate display

**Scenario 2: Drag & Drop Sliders** (`tests/drag-drop-slider.spec.ts`)
- Open TestMu AI Selenium Playground
- Click "Drag & Drop Sliders"
- Drag slider from 15 to 95
- Validate slider value

**Scenario 3: Input Form Submit** (`tests/input-form-submit.spec.ts`)
- Open TestMu AI Selenium Playground
- Click "Input Form Submit"
- Validate empty form error
- Fill and submit form
- Validate success message

### Page Objects

```
src/pages/
├── BasePage.ts              (Base class with common methods)
├── PlaygroundHomePage.ts    (Navigation)
├── SimpleFormDemoPage.ts    (Scenario 1)
├── DragDropSlidersPage.ts   (Scenario 2)
└── InputFormSubmitPage.ts   (Scenario 3)
```

### Test Data

```
src/data/
└── testData.ts              (Parameterized data)
```

### Fixtures

```
src/fixtures/
└── test-fixtures.ts         (Custom fixtures)
```

---

## 🔍 Troubleshooting

### Issue: Tests fail with "Cannot find module"
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Issue: Browser not found
**Solution**: Install Playwright browsers
```bash
npx playwright install
npx playwright install-deps
```

### Issue: Environment variables not working
**Solution**: 
1. Check `.env` file exists
2. Ensure variables are defined
3. Reload terminal/IDE
```bash
# Verify variable
echo $BASE_URL
```

### Issue: HyperExecute CLI not found
**Solution**: Download and setup CLI
```bash
wget https://downloads.lambdatest.com/hyperexecute/linux/hyperexecute
chmod +x hyperexecute
./hyperexecute --version
```

### Issue: GitHub Actions workflow not triggering
**Solution**:
1. Check workflow file syntax
2. Verify branch name in triggers
3. Check secrets are configured
4. View Actions tab for error logs

### Issue: Artifacts not uploading
**Solution**:
1. Verify test results exist
2. Check artifact paths in YAML
3. Ensure proper permissions
4. Check HyperExecute storage limits

### Issue: Slack notifications not sending
**Solution**:
1. Verify `SLACK_WEBHOOK_URL` secret exists
2. Check webhook URL validity
3. Ensure organization allows webhooks
4. Review GitHub Actions logs

---

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [LambdaTest HyperExecute Docs](https://www.lambdatest.com/hyperexecute)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [TestMu AI Selenium Playground](https://www.testmuai.com/selenium-playground/)

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review GitHub Actions logs
3. Check HyperExecute job logs
4. Contact LambdaTest support

---

## ✅ Checklist

Before running on HyperExecute:

- [ ] All dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] Environment variables configured (`.env` file)
- [ ] Tests pass locally (`npm test`)
- [ ] GitHub repository created and pushed
- [ ] LambdaTest account active
- [ ] HyperExecute secrets configured
- [ ] GitHub secrets configured
- [ ] `.github/workflows/hyperexecute.yml` committed

---

**Last Updated**: October 2, 2026
**Framework Version**: Playwright 1.48.0+
**Node Version**: 18.x+
