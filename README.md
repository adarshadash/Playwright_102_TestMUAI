# Playwright 102 - TestMu AI Selenium Playground

Page Object Model + data-driven Playwright tests, runnable locally and on the HyperExecute grid.

## Layout
- `src/pages` page objects (`BasePage` + one per page), `src/fixtures` fixtures, `src/data` test data, `src/config/capabilities.ts` LambdaTest capabilities
- `tests` Scenario 1 (simple form), 2 (drag slider to 95), 3 (input form)

## Run locally
```
npm ci && npx playwright install
npm test                      # local-chromium + local-firefox
```

## Run on HyperExecute
1. Dashboard > Secrets: create `LT_USERNAME` and `LT_ACCESS_KEY`.
2. `./hyperexecute --user $LT_USERNAME --key $LT_ACCESS_KEY --config hyperexecute.yaml`

`hyperexecute.yaml` runs two browser/OS combinations in parallel on the HyperExecute grid — Chromium on a
Windows 10 VM and Chromium on a Linux VM — and shows secrets, injected env vars, pre steps + dependency
caching, post steps and merged artifacts. Video, screenshots and traces are recorded by Playwright on each
VM (`playwright.config.ts`) and collected into the merged artifacts.

Set `RUN_TARGET=lt-grid` instead to connect out to the LambdaTest Playwright grid
(`src/config/capabilities.ts`), where the browser runs on a LambdaTest machine rather than the HyperExecute VM.
That grid offers Windows and macOS only — it has no Linux platform.

GitHub Actions (`.github/workflows/hyperexecute.yml`) triggers the same run; add `LT_USERNAME` / `LT_ACCESS_KEY` as repo secrets.
