// Archive each task's playwright-report into a separate directory so they don't collide
// when HyperExecute merges artifacts from multiple tasks running on the same VM.
// Each task generates its own playwright-report/ with videos in data/*.webm, and those
// paths are relative to the report. When N tasks on one VM write to the same
// playwright-report/, the last task's version wins, losing the others' videos.
//
// This script copies the current task's report into he-reports/<slug>/, preserving
// all video paths. The slug matches he-task.js's outputDir slug so reports and
// test results are co-located and traceable.
const fs = require('fs');
const path = require('path');

function archiveReports() {
  const testResultsDir = 'test-results';

  // Find all task output directories (test-results/slug/)
  let taskDirs = [];
  try {
    taskDirs = fs.readdirSync(testResultsDir)
      .filter(name => fs.statSync(path.join(testResultsDir, name)).isDirectory())
      .map(name => path.join(testResultsDir, name));
  } catch {
    console.log('[archive-reports] test-results not found or unreadable');
    return;
  }

  console.log(`[archive-reports] found ${taskDirs.length} task output directories`);

  // No task directory means this invocation didn't create test-results/<slug>/
  // This can happen if test discovery found nothing or the wrapper didn't run.
  // The shared playwright-report/ may still be valid from a sibling's previous run.
  if (taskDirs.length === 0) {
    console.log('[archive-reports] no task directories found; playwright-report/ kept as-is');
    return;
  }

  // With autosplit and multiple tasks per VM, exactly one task runs per invocation.
  // Bail if the invariant is violated, to avoid data loss from guessing which dir's report to archive.
  if (taskDirs.length > 1) {
    console.log(
      `[archive-reports] ERROR: found ${taskDirs.length} task directories, expected 1 per invocation`,
    );
    console.log('[archive-reports] skipping archive to avoid data loss');
    return;
  }

  const taskDir = taskDirs[0];
  const slug = path.basename(taskDir);
  const reportSrc = 'playwright-report';
  const reportDest = path.join('he-reports', slug);

  // Copy the task's current playwright-report into he-reports/<slug>
  if (!fs.existsSync(reportSrc)) {
    console.log(
      `[archive-reports] slug=${slug} playwright-report/ not found; skipping archive`,
    );
    return;
  }

  try {
    // Create he-reports/ if needed
    if (!fs.existsSync('he-reports')) {
      fs.mkdirSync('he-reports', { recursive: true });
    }

    // Recursively copy the report tree
    function copyDir(src, dest) {
      fs.mkdirSync(dest, { recursive: true });
      for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    copyDir(reportSrc, reportDest);
    console.log(`[archive-reports] slug=${slug} report archived to ${reportDest}/`);
  } catch (err) {
    console.log(`[archive-reports] ERROR archiving report: ${err.message}`);
  }
}

if (require.main === module) {
  archiveReports();
}

module.exports = archiveReports;
