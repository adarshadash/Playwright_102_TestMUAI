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

`hyperexecute.yaml` runs Windows 10 Chrome and macOS Monterey Chrome on the LambdaTest grid in parallel
(one grid session per task) and shows secrets, injected env vars,
pre steps + dependency caching, post steps and merged artifacts. Network logs, video, console logs and screenshots
are enabled in `src/config/capabilities.ts` (`network`, `video`, `console`, `visual`).

GitHub Actions (`.github/workflows/hyperexecute.yml`) triggers the same run; add `LT_USERNAME` / `LT_ACCESS_KEY` as repo secrets.
