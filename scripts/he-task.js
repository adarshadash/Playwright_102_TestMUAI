// One HyperExecute autosplit task = one `playwright test` invocation. Playwright clears its
// output directory at the start of every invocation, and the worker scratch dir it records
// video into (.playwright-artifacts-<workerIndex>) has the same name every time, so sibling
// tasks sharing a VM delete each other's in-flight recordings. Giving each invocation its own
// --output directory makes that collision impossible.
//
// Written in Node rather than shell because the matrix spans win and linux, so one
// testRunnerCommand string has to run under both PowerShell and bash.
const { spawnSync } = require('child_process');
const path = require('path');
const reportVideos = require('./report-videos');

const spec = process.argv[2];
const project = process.argv[3];

if (!spec || !project) {
  console.error('usage: node scripts/he-task.js <spec-file> <project>');
  process.exit(2);
}

// process.platform rather than the matrix $os, so the win and linux legs stay distinct after
// mergeArtifacts without depending on which variables HyperExecute interpolates.
const slug = [
  spec
    .replace(/\.spec\.[cm]?[tj]sx?$/i, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, ''),
  project,
  process.platform,
]
  .join('__')
  .toLowerCase();

const outputDir = path.posix.join('test-results', slug);

// playwright/cli is not in the package exports map, so go via its package.json.
const cli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');

console.log(`[he-task] spec=${spec} project=${project}`);
console.log(`[he-task] outputDir=${outputDir}`);
console.log(
  `[he-task] platform=${process.platform} HEADLESS=${process.env.HEADLESS} DISPLAY=${process.env.DISPLAY || '<unset>'}`,
);

const run = spawnSync(
  process.execPath,
  [cli, 'test', spec, `--project=${project}`, `--output=${outputDir}`],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PLAYWRIGHT_JSON_OUTPUT_FILE: path.posix.join(outputDir, 'results.json'),
      PLAYWRIGHT_JUNIT_OUTPUT_FILE: path.posix.join(outputDir, 'junit.xml'),
    },
  },
);

reportVideos(outputDir);

process.exit(run.status === null ? 1 : run.status);
