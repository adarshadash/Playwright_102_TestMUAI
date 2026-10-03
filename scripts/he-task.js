#!/usr/bin/env node
/**
 * HyperExecute per-task wrapper.
 * Isolates each task's artifacts to prevent collision when multiple tasks run on same VM.
 *
 * Usage: node scripts/he-task.js <spec-file> <project-name>
 * Example: node scripts/he-task.js tests/simple-form-demo.spec.ts chromium
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

function sanitizeSlug(input) {
  // Strip .spec.ts suffix, replace non-[A-Za-z0-9._-] with '-'
  let slug = input.replace(/\.spec\.ts$/, '');
  slug = slug.replace(/[^A-Za-z0-9._-]/g, '-');
  return slug;
}

function main() {
  const spec = process.argv[2];
  const project = process.argv[3];

  if (!spec || !project) {
    console.error('[he-task] Usage: node scripts/he-task.js <spec-file> <project-name>');
    process.exit(1);
  }

  // Derive filesystem-safe slug: spec + project + platform
  const specSlug = sanitizeSlug(spec);
  const slug = `${specSlug}__${project}__${process.platform}`;
  const outputDir = path.join('test-results', slug);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Log diagnostic info
  console.log(`[he-task] spec=${spec} project=${project}`);
  console.log(`[he-task] outputDir=${outputDir}`);
  console.log(`[he-task] platform=${process.platform} HEADLESS=${process.env.HEADLESS || '<unset>'} DISPLAY=${process.env.DISPLAY || '<unset>'}`);

  // Set up reporter output files
  const jsonOutputFile = path.join(outputDir, 'results.json');
  const junitOutputFile = path.join(outputDir, 'junit.xml');

  // Resolve playwright CLI path
  let playwrightCli;
  try {
    const pkgJsonPath = require.resolve('playwright/package.json');
    const pkgDir = path.dirname(pkgJsonPath);
    playwrightCli = path.join(pkgDir, 'cli.js');
  } catch (e) {
    console.error('[he-task] Failed to resolve playwright CLI:', e.message);
    process.exit(1);
  }

  // Build playwright test command
  const cmd = [
    'node',
    playwrightCli,
    'test',
    spec,
    `--project=${project}`,
    `--output=${outputDir}`,
  ];

  // Run with environment overrides for reporters
  const env = {
    ...process.env,
    PLAYWRIGHT_JSON_OUTPUT_FILE: jsonOutputFile,
    PLAYWRIGHT_JUNIT_OUTPUT_FILE: junitOutputFile,
  };

  console.log(`[he-task] running: ${cmd.join(' ')}`);

  // Execute and capture exit code
  const result = spawnSync(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    env,
  });

  const exitCode = result.status !== null ? result.status : 1;
  console.log(`[he-task] status=${exitCode === 0 ? 'PASSED' : 'FAILED'} exitCode=${exitCode}`);

  // Report videos unconditionally
  try {
    const reportVideosScript = path.join(__dirname, 'report-videos.js');
    require(reportVideosScript);
  } catch (e) {
    console.warn('[he-task] warning: report-videos.js failed:', e.message);
  }

  // Propagate the exit code so HyperExecute sees pass/fail correctly
  process.exit(exitCode);
}

main();
