// Cross-platform test discovery for HyperExecute: prints one spec file path per line.
// HyperExecute uses this to populate the test scenarios matrix.
const fs = require('fs');
const path = require('path');

const dir = 'tests';
const testFiles = fs.readdirSync(dir)
  .filter((file) => file.endsWith('.spec.ts'))
  .map((file) => path.posix.join(dir, file))
  .sort();

// Output each test file on a separate line
// HyperExecute will cross this with the matrix (os, browser) to create scenarios
testFiles.forEach((file) => console.log(file));
