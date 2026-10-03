// Prints every .webm under a directory with its byte size.
// Playwright swallows video-save failures (lib/index.js catches saveAs with an empty block),
// so a run that captured nothing looks identical to one that captured fine. This makes the
// difference visible in the job log without downloading artifacts.
const fs = require('fs');
const path = require('path');

function reportVideos(root) {
  const found = [];

  (function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.toLowerCase().endsWith('.webm')) {
        try {
          found.push([full, fs.statSync(full).size]);
        } catch {
          found.push([full, -1]);
        }
      }
    }
  })(root);

  console.log(`[video-check] root=${root} webm_files=${found.length}`);
  for (const [file, size] of found) {
    const tag = size === 0 ? 'EMPTY' : size < 0 ? 'STAT?' : 'OK   ';
    console.log(`[video-check] ${tag} ${String(size).padStart(9)} bytes  ${file}`);
  }

  if (found.length === 0) {
    console.log('[video-check] RESULT=NO_FILES  no video artifact registered -> zero frames, or source deleted before saveAs');
  } else if (found.every(([, size]) => size === 0)) {
    console.log('[video-check] RESULT=ALL_EMPTY  ffmpeg never flushed -> process killed, or file unlinked mid-write');
  } else {
    console.log('[video-check] RESULT=PASS');
  }

  return found;
}

module.exports = reportVideos;

if (require.main === module) {
  reportVideos(process.argv[2] || 'test-results');
}
