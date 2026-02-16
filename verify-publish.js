#!/usr/bin/env node

/**
 * Pre-publish verification script
 * Checks if the package is ready for npm publishing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const checks = [];
const warnings = [];
const errors = [];

console.log('🔍 InterviewQuest - Pre-Publish Verification\n');
console.log('═══════════════════════════════════════════════\n');

// Check 1: package.json exists and is valid
try {
  const pkg = require('./package.json');
  checks.push('✅ package.json is valid');
  
  // Check required fields
  if (!pkg.name) errors.push('❌ package.json missing "name" field');
  else checks.push(`✅ Package name: ${pkg.name}`);
  
  if (!pkg.version) errors.push('❌ package.json missing "version" field');
  else checks.push(`✅ Version: ${pkg.version}`);
  
  if (!pkg.description) warnings.push('⚠️  package.json missing "description" field');
  else checks.push(`✅ Description: ${pkg.description.substring(0, 50)}...`);
  
  if (!pkg.author) warnings.push('⚠️  package.json missing "author" field - UPDATE THIS!');
  else checks.push(`✅ Author: ${typeof pkg.author === 'object' ? pkg.author.name : pkg.author}`);
  
  if (!pkg.repository) warnings.push('⚠️  package.json missing "repository" field - UPDATE THIS!');
  else checks.push(`✅ Repository configured`);
  
  if (!pkg.license) warnings.push('⚠️  package.json missing "license" field');
  else checks.push(`✅ License: ${pkg.license}`);
  
  if (!pkg.bin) errors.push('❌ package.json missing "bin" field');
  else checks.push(`✅ Binary command: ${Object.keys(pkg.bin)[0]}`);
  
} catch (e) {
  errors.push('❌ package.json is invalid or missing');
}

// Check 2: README.md exists
if (fs.existsSync('README.md')) {
  checks.push('✅ README.md exists');
} else {
  warnings.push('⚠️  README.md not found');
}

// Check 3: LICENSE exists
if (fs.existsSync('LICENSE')) {
  checks.push('✅ LICENSE file exists');
} else {
  warnings.push('⚠️  LICENSE file not found');
}

// Check 4: dist directory exists
if (fs.existsSync('dist')) {
  checks.push('✅ dist/ directory exists');
  
  // Check bin file
  if (fs.existsSync('dist/bin/interviewquest.js')) {
    checks.push('✅ Binary file compiled');
    
    // Check shebang
    const binContent = fs.readFileSync('dist/bin/interviewquest.js', 'utf8');
    if (binContent.startsWith('#!/usr/bin/env node')) {
      checks.push('✅ Binary has correct shebang');
    } else {
      errors.push('❌ Binary missing shebang (#!/usr/bin/env node)');
    }
  } else {
    errors.push('❌ dist/bin/interviewquest.js not found');
  }
} else {
  errors.push('❌ dist/ directory not found - run "npm run build"');
}

// Check 5: TypeScript compilation
try {
  execSync('npm run build', { stdio: 'ignore' });
  checks.push('✅ TypeScript compiles successfully');
} catch (e) {
  errors.push('❌ TypeScript compilation failed');
}

// Check 6: node_modules exists
if (fs.existsSync('node_modules')) {
  checks.push('✅ Dependencies installed');
} else {
  errors.push('❌ node_modules not found - run "npm install"');
}

// Check 7: .npmignore exists
if (fs.existsSync('.npmignore')) {
  checks.push('✅ .npmignore configured');
} else {
  warnings.push('⚠️  .npmignore not found - all files may be published');
}

// Print results
console.log('CHECKS:\n');
checks.forEach(check => console.log(check));

if (warnings.length > 0) {
  console.log('\n\nWARNINGS:\n');
  warnings.forEach(warning => console.log(warning));
}

if (errors.length > 0) {
  console.log('\n\nERRORS:\n');
  errors.forEach(error => console.log(error));
}

console.log('\n═══════════════════════════════════════════════\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✨ ALL CHECKS PASSED! Ready to publish!\n');
  console.log('Next steps:');
  console.log('1. npm login');
  console.log('2. npm publish\n');
  process.exit(0);
} else if (errors.length === 0) {
  console.log('⚠️  WARNINGS FOUND - Review before publishing\n');
  console.log('To continue anyway:');
  console.log('1. npm login');
  console.log('2. npm publish\n');
  process.exit(0);
} else {
  console.log('❌ ERRORS FOUND - Fix before publishing\n');
  process.exit(1);
}
