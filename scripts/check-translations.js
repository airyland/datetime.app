#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../messages');
const BASE_LANG = 'en';

// Color output utilities
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Recursively get all key paths from an object
function getKeyPaths(obj, prefix = '') {
  const paths = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      paths.push(...getKeyPaths(value, currentPath));
    } else {
      paths.push(currentPath);
    }
  }
  
  return paths;
}

// Recursively get nested object value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}


// Load translation files
function loadTranslations() {
  const translations = {};
  const files = fs.readdirSync(MESSAGES_DIR).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    const lang = path.basename(file, '.json');
    const filePath = path.join(MESSAGES_DIR, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(content);
    } catch (error) {
      console.error(colorize(`Error: Unable to read ${file}: ${error.message}`, 'red'));
      process.exit(1);
    }
  }
  
  return translations;
}

// Check translation completeness
function checkTranslations() {
  const translations = loadTranslations();
  
  if (!translations[BASE_LANG]) {
    console.error(colorize(`Error: Base language file ${BASE_LANG}.json not found`, 'red'));
    process.exit(1);
  }
  
  const baseKeys = getKeyPaths(translations[BASE_LANG]);
  const langs = Object.keys(translations).filter(lang => lang !== BASE_LANG);
  
  console.log(colorize(`\n🔍 Checking translation completeness (based on ${BASE_LANG}.json)`, 'cyan'));
  console.log(colorize(`📋 Base language has ${baseKeys.length} translation keys`, 'blue'));
  console.log(colorize(`🌐 Checking ${langs.length} languages: ${langs.join(', ')}`, 'blue'));
  console.log('─'.repeat(80));
  
  const missingKeys = {};
  let totalMissing = 0;
  
  for (const lang of langs) {
    const langKeys = getKeyPaths(translations[lang]);
    const missing = baseKeys.filter(key => !langKeys.includes(key));
    
    if (missing.length > 0) {
      missingKeys[lang] = missing;
      totalMissing += missing.length;
      
      const coverage = ((baseKeys.length - missing.length) / baseKeys.length * 100).toFixed(1);
      console.log(colorize(`\n❌ ${lang}.json`, 'red'));
      console.log(`   Coverage: ${coverage}% (missing ${missing.length}/${baseKeys.length} keys)`);
      
      missing.forEach(key => {
        console.log(colorize(`   - ${key}`, 'yellow'));
      });
    } else {
      console.log(colorize(`\n✅ ${lang}.json`, 'green'));
      console.log('   Coverage: 100% (complete)');
    }
  }
  
  console.log('─'.repeat(80));
  
  if (totalMissing > 0) {
    console.log(colorize(`\n📊 Summary:`, 'cyan'));
    console.log(colorize(`   🔴 Found ${totalMissing} missing translation keys`, 'red'));
    console.log(colorize(`   📝 Affecting ${Object.keys(missingKeys).length} language files`, 'yellow'));
    
    return { hasIssues: true, missingKeys, translations, baseKeys };
  } else {
    console.log(colorize(`\n🎉 All translation files are complete!`, 'green'));
    return { hasIssues: false };
  }
}

// Report missing translation keys
function reportMissingKeys(missingKeys, translations, baseKeys) {
  console.log(colorize('\n📋 Detailed missing keys report:', 'cyan'));
  
  for (const [lang, keys] of Object.entries(missingKeys)) {
    console.log(colorize(`\n📝 ${lang}.json missing keys:`, 'blue'));
    
    for (const keyPath of keys) {
      const baseValue = getNestedValue(translations[BASE_LANG], keyPath);
      
      if (baseValue !== undefined) {
        console.log(colorize(`   - ${keyPath}: "${baseValue}"`, 'yellow'));
      }
    }
    
    console.log(colorize(`   Total: ${keys.length} missing keys`, 'red'));
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const showDetails = args.includes('--details') || args.includes('-d');
  
  console.log(colorize('🌍 Translation File Completeness Checker', 'magenta'));
  
  const result = checkTranslations();
  
  if (result.hasIssues) {
    if (showDetails) {
      reportMissingKeys(result.missingKeys, result.translations, result.baseKeys);
    }
    console.log(colorize('\n💡 Use --details or -d parameter to see detailed missing keys report', 'yellow'));
    console.log(colorize('   Example: node scripts/check-translations.js --details', 'yellow'));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkTranslations,
  reportMissingKeys,
  getKeyPaths,
  loadTranslations
};