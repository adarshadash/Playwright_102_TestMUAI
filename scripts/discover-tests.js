// Cross-platform test discovery for HyperExecute: prints one spec file path per line.
const fs = require('fs');
const path = require('path');

const dir = 'tests';
fs.readdirSync(dir)
  .filter((file) => file.endsWith('.spec.ts'))
  .forEach((file) => console.log(path.posix.join(dir, file)));
