// Merge junit.xml files from all task subdirectories into a single consolidated results file.
// HyperExecute parses this single file to determine overall pass/fail/skip status.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function mergeResults() {
  const testResultsDir = 'test-results';

  console.log(`[merge-results] starting merge from ${testResultsDir}`);

  // Find all task output directories (test-results/slug/)
  let taskDirs = [];
  try {
    taskDirs = fs.readdirSync(testResultsDir)
      .filter(name => fs.statSync(path.join(testResultsDir, name)).isDirectory())
      .map(name => path.join(testResultsDir, name));
  } catch (err) {
    console.log(`[merge-results] ERROR: test-results not found or unreadable: ${err.message}`);
    return;
  }

  console.log(`[merge-results] found ${taskDirs.length} task output directories`);
  taskDirs.forEach(dir => console.log(`[merge-results]   - ${dir}`));

  if (taskDirs.length === 0) {
    console.log('[merge-results] no task directories found');
    return;
  }

  // Collect all junit.xml files
  const junitFiles = [];
  for (const taskDir of taskDirs) {
    const junitPath = path.join(taskDir, 'junit.xml');
    if (fs.existsSync(junitPath)) {
      const size = fs.statSync(junitPath).size;
      console.log(`[merge-results]   ✓ ${junitPath} (${size} bytes)`);
      junitFiles.push(junitPath);
    } else {
      console.log(`[merge-results]   ✗ ${junitPath} (not found)`);
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
tree.write('junit.xml', encoding='utf-8', xml_declaration=True)
print('[merge-results] merged junit.xml written to root')
`;

    execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    });
    console.log('[merge-results] ✓ Python merge completed successfully');
  } catch (err) {
    // Fallback: if Python isn't available, try a simpler Node-based approach
    console.log(`[merge-results] ⚠ Python merge failed: ${err.message}`);
    console.log('[merge-results] falling back to Node-based merge');
    mergeResultsNode(junitFiles);
  }
}

function mergeResultsNode(junitFiles) {
  // XML parsing and merging using simple DOM-like approach
  let totalTests = 0;
  let totalFailures = 0;
  let totalSkipped = 0;
  let totalTime = 0;
  let allTestSuites = [];

  for (const junitFile of junitFiles) {
    try {
      const content = fs.readFileSync(junitFile, 'utf-8');

      // Extract complete testsuite elements (opening tag to closing tag)
      const suiteRegex = /<testsuite([^>]*)>([\s\S]*?)<\/testsuite>/g;
      let match;

      while ((match = suiteRegex.exec(content)) !== null) {
        const attributes = match[1];
        const content = match[2];
        const fullSuite = match[0];

        // Extract metrics
        const testsMatch = attributes.match(/tests="(\d+)"/);
        const failuresMatch = attributes.match(/failures="(\d+)"/);
        const skippedMatch = attributes.match(/skipped="(\d+)"/);
        const timeMatch = attributes.match(/time="([\d.]+)"/);

        if (testsMatch) totalTests += parseInt(testsMatch[1]);
        if (failuresMatch) totalFailures += parseInt(failuresMatch[1]);
        if (skippedMatch) totalSkipped += parseInt(skippedMatch[1]);
        if (timeMatch) totalTime += parseFloat(timeMatch[1]);

        allTestSuites.push(fullSuite);
      }
    } catch (err) {
      console.log(`[merge-results] error reading ${junitFile}: ${err.message}`);
    }
  }

  // Build consolidated junit.xml
  const merged = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="${totalTests}" failures="${totalFailures}" skipped="${totalSkipped}" time="${totalTime}">
${allTestSuites.map(s => '  ' + s).join('\n')}
</testsuites>`;

  // Write to root junit.xml where HyperExecute expects it (resultFilePath: junit.xml)
  try {
    fs.writeFileSync('junit.xml', merged);
    const stats = fs.statSync('junit.xml');
    console.log(`[merge-results] ✓ junit.xml written to root (${stats.size} bytes)`);
    console.log(`[merge-results] RESULT: ${totalTests} tests, ${totalFailures} failures, ${totalSkipped} skipped`);
  } catch (err) {
    console.log(`[merge-results] ERROR writing junit.xml: ${err.message}`);
  }
}

if (require.main === module) {
  mergeResults();
}

module.exports = mergeResults;
