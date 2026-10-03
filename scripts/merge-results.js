// Merge junit.xml files from all task subdirectories into a single consolidated results file.
// HyperExecute parses this single file to determine overall pass/fail/skip status.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function mergeResults() {
  const testResultsDir = 'test-results';

  // Find all task output directories (test-results/slug/)
  let taskDirs = [];
  try {
    taskDirs = fs.readdirSync(testResultsDir)
      .filter(name => fs.statSync(path.join(testResultsDir, name)).isDirectory())
      .map(name => path.join(testResultsDir, name));
  } catch {
    console.log('[merge-results] test-results not found or unreadable');
    return;
  }

  console.log(`[merge-results] found ${taskDirs.length} task output directories`);

  if (taskDirs.length === 0) {
    console.log('[merge-results] no task directories found');
    return;
  }

  // Collect all junit.xml files
  const junitFiles = [];
  for (const taskDir of taskDirs) {
    const junitPath = path.join(taskDir, 'junit.xml');
    if (fs.existsSync(junitPath)) {
      junitFiles.push(junitPath);
    }
  }

  console.log(`[merge-results] found ${junitFiles.length} junit.xml files to merge`);

  if (junitFiles.length === 0) {
    console.log('[merge-results] no junit.xml files found to merge');
    return;
  }

  try {
    // Use Python to merge JUnit XML files (more reliable than manual parsing)
    // This merges multiple junit.xml files into a single consolidated file
    const pythonScript = `
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

junit_files = [${junitFiles.map(f => `'${f}'`).join(', ')}]
root = ET.Element('testsuites')

total_tests = 0
total_failures = 0
total_skipped = 0
total_time = 0.0

for junit_file in junit_files:
    if Path(junit_file).exists():
        tree = ET.parse(junit_file)
        suite = tree.getroot()

        # Handle both <testsuites> and <testsuite> root elements
        if suite.tag == 'testsuites':
            for child in suite:
                root.append(child)
                # Update totals
                total_tests += int(child.get('tests', 0))
                total_failures += int(child.get('failures', 0))
                total_skipped += int(child.get('skipped', 0))
                total_time += float(child.get('time', 0))
        else:
            root.append(suite)
            total_tests += int(suite.get('tests', 0))
            total_failures += int(suite.get('failures', 0))
            total_skipped += int(suite.get('skipped', 0))
            total_time += float(suite.get('time', 0))

# Set aggregate attributes
root.set('tests', str(total_tests))
root.set('failures', str(total_failures))
root.set('skipped', str(total_skipped))
root.set('time', str(total_time))

tree = ET.ElementTree(root)
tree.write('test-results/junit.xml', encoding='utf-8', xml_declaration=True)
print('[merge-results] merged junit.xml written to test-results/junit.xml')
`;

    execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    });
  } catch (err) {
    // Fallback: if Python isn't available, try a simpler Node-based approach
    console.log('[merge-results] Python merge failed, trying Node fallback');
    mergeResultsNode(junitFiles);
  }
}

function mergeResultsNode(junitFiles) {
  // Simple XML concatenation for testsuites
  let totalTests = 0;
  let totalFailures = 0;
  let totalSkipped = 0;
  let totalTime = 0;
  let allTestSuites = [];

  for (const junitFile of junitFiles) {
    try {
      const content = fs.readFileSync(junitFile, 'utf-8');
      // Simple regex-based parsing to extract testsuite elements
      const suiteMatches = content.match(/<testsuite[^>]*>/g);
      if (suiteMatches) {
        for (const suiteMatch of suiteMatches) {
          const testsMatch = suiteMatch.match(/tests="(\d+)"/);
          const failuresMatch = suiteMatch.match(/failures="(\d+)"/);
          const skippedMatch = suiteMatch.match(/skipped="(\d+)"/);
          const timeMatch = suiteMatch.match(/time="([\d.]+)"/);

          if (testsMatch) totalTests += parseInt(testsMatch[1]);
          if (failuresMatch) totalFailures += parseInt(failuresMatch[1]);
          if (skippedMatch) totalSkipped += parseInt(skippedMatch[1]);
          if (timeMatch) totalTime += parseFloat(timeMatch[1]);

          allTestSuites.push(suiteMatch);
        }
      }
    } catch (err) {
      console.log(`[merge-results] error reading ${junitFile}: ${err.message}`);
    }
  }

  // Build consolidated junit.xml
  const merged = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="${totalTests}" failures="${totalFailures}" skipped="${totalSkipped}" time="${totalTime}">
  ${allTestSuites.join('\n  ')}
</testsuites>`;

  fs.writeFileSync('test-results/junit.xml', merged);
  console.log(`[merge-results] merged junit.xml written: ${totalTests} tests, ${totalFailures} failures, ${totalSkipped} skipped`);
}

if (require.main === module) {
  mergeResults();
}

module.exports = mergeResults;
