#!/usr/bin/env node
/**
 * Report video file sizes in a directory tree.
 * Usable as a module (called from he-task.js wrapper) and standalone (from post:).
 * Prints: [video-check] <status> <size> <path>
 * Exits with RESULT=PASS | ALL_EMPTY | NO_FILES line
 */

const fs = require('fs');
const path = require('path');

function findWebmFiles(dir) {
  const results = [];

  function walk(current) {
    if (!fs.existsSync(current)) return;

    const items = fs.readdirSync(current);
    for (const item of items) {
      const fullPath = path.join(current, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.webm')) {
        const bytes = stat.size;
        results.push({ path: fullPath, bytes });
      }
    }
  }

  walk(dir);
  return results;
}

function main() {
  const dir = process.argv[2] || 'test-results';

  if (!fs.existsSync(dir)) {
    console.log('[video-check] NO_FILES');
    process.stdout.write('RESULT=NO_FILES\n');
    return;
  }

  const webmFiles = findWebmFiles(dir);

  if (webmFiles.length === 0) {
    console.log('[video-check] NO_FILES');
    process.stdout.write('RESULT=NO_FILES\n');
    return;
  }

  let allEmpty = true;
  for (const file of webmFiles) {
    const status = file.bytes === 0 ? 'EMPTY' : 'OK';
    console.log(`[video-check] ${status}        ${file.bytes} bytes  ${file.path}`);
    if (file.bytes > 0) allEmpty = false;
  }

  const result = allEmpty ? 'ALL_EMPTY' : 'PASS';
  process.stdout.write(`RESULT=${result}\n`);
}

main();
