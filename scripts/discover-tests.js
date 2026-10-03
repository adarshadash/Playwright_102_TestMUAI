// Test discovery for HyperExecute: output spec file paths one per line
const fs = require('fs');
const path = require('path');

const dir = 'tests';
const testFiles = fs.readdirSync(dir)
  .filter((file) => file.endsWith('.spec.ts'))
  .map((file) => path.posix.join(dir, file))
  .sort();

testFiles.forEach((file) => console.log(file));
