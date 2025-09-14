#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the cities data from the metadata file
const metadataPath = path.join(__dirname, '../app/[locale]/cities/[city]/metadata.ts');
const messagesDir = path.join(__dirname, '../messages');

// Color output utilities
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Parse the metadata.ts file to extract cities and countries
function extractCitiesData() {
  const content = fs.readFileSync(metadataPath, 'utf8');

  // Extract city keys and their countries
  const cityRegex = /'([^']+)':\s*\{[^}]*country:\s*'([^']+)'/g;
  const cities = {};
  const countries = new Set();

  let match;
  while ((match = cityRegex.exec(content)) !== null) {
    const cityKey = match[1];
    const country = match[2];
    cities[cityKey] = country;
    countries.add(country);
  }

  return { cities, countries: Array.from(countries) };
}

// Load all translation files
function loadTranslations() {
  const translations = {};
  const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const lang = path.basename(file, '.json');
    const filePath = path.join(messagesDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      translations[lang] = JSON.parse(content);
    } catch (error) {
      console.error(colorize(`Error loading ${file}: ${error.message}`, 'red'));
      process.exit(1);
    }
  }

  return translations;
}

// Validate city and country translations
function validateTranslations() {
  console.log(colorize('🏙️  City & Country Translation Validator', 'magenta'));
  console.log(colorize('=' .repeat(80), 'gray'));

  const { cities, countries } = extractCitiesData();
  const translations = loadTranslations();

  const cityKeys = Object.keys(cities);

  console.log(colorize(`\n📊 Metadata Analysis:`, 'cyan'));
  console.log(colorize(`   • Found ${cityKeys.length} cities in metadata.ts`, 'blue'));
  console.log(colorize(`   • Found ${countries.length} unique countries`, 'blue'));

  const languages = Object.keys(translations);
  console.log(colorize(`   • Checking ${languages.length} language files`, 'blue'));
  console.log(colorize('=' .repeat(80), 'gray'));

  let hasErrors = false;
  const issues = {};

  // Check each language file
  for (const lang of languages) {
    const langData = translations[lang];
    const langIssues = {
      missingCities: [],
      missingCountries: [],
      emptyCities: [],
      emptyCountries: []
    };

    // Check if cities section exists
    if (!langData.cities) {
      console.error(colorize(`\n❌ ${lang}.json: Missing 'cities' section entirely!`, 'red'));
      hasErrors = true;
      continue;
    }

    // Check city names
    if (!langData.cities.cityNames) {
      langIssues.missingCities = cityKeys;
    } else {
      for (const cityKey of cityKeys) {
        if (!(cityKey in langData.cities.cityNames)) {
          langIssues.missingCities.push(cityKey);
        } else if (!langData.cities.cityNames[cityKey] || langData.cities.cityNames[cityKey].trim() === '') {
          langIssues.emptyCities.push(cityKey);
        }
      }
    }

    // Check country names
    if (!langData.cities.countryNames) {
      langIssues.missingCountries = countries;
    } else {
      for (const country of countries) {
        if (!(country in langData.cities.countryNames)) {
          langIssues.missingCountries.push(country);
        } else if (!langData.cities.countryNames[country] || langData.cities.countryNames[country].trim() === '') {
          langIssues.emptyCountries.push(country);
        }
      }
    }

    // Calculate totals
    const totalIssues =
      langIssues.missingCities.length +
      langIssues.missingCountries.length +
      langIssues.emptyCities.length +
      langIssues.emptyCountries.length;

    if (totalIssues > 0) {
      hasErrors = true;
      issues[lang] = langIssues;

      // Report issues for this language
      console.log(colorize(`\n❌ ${lang}.json has ${totalIssues} issue(s):`, 'red'));

      if (langIssues.missingCities.length > 0) {
        console.log(colorize(`   ⚠️  Missing ${langIssues.missingCities.length} city translations:`, 'yellow'));
        langIssues.missingCities.slice(0, 5).forEach(city => {
          console.log(colorize(`      - cities.cityNames.${city}`, 'gray'));
        });
        if (langIssues.missingCities.length > 5) {
          console.log(colorize(`      ... and ${langIssues.missingCities.length - 5} more`, 'gray'));
        }
      }

      if (langIssues.emptyCities.length > 0) {
        console.log(colorize(`   ⚠️  ${langIssues.emptyCities.length} empty city translations:`, 'yellow'));
        langIssues.emptyCities.slice(0, 3).forEach(city => {
          console.log(colorize(`      - cities.cityNames.${city} is empty`, 'gray'));
        });
        if (langIssues.emptyCities.length > 3) {
          console.log(colorize(`      ... and ${langIssues.emptyCities.length - 3} more`, 'gray'));
        }
      }

      if (langIssues.missingCountries.length > 0) {
        console.log(colorize(`   ⚠️  Missing ${langIssues.missingCountries.length} country translations:`, 'yellow'));
        langIssues.missingCountries.slice(0, 5).forEach(country => {
          console.log(colorize(`      - cities.countryNames["${country}"]`, 'gray'));
        });
        if (langIssues.missingCountries.length > 5) {
          console.log(colorize(`      ... and ${langIssues.missingCountries.length - 5} more`, 'gray'));
        }
      }

      if (langIssues.emptyCountries.length > 0) {
        console.log(colorize(`   ⚠️  ${langIssues.emptyCountries.length} empty country translations:`, 'yellow'));
        langIssues.emptyCountries.slice(0, 3).forEach(country => {
          console.log(colorize(`      - cities.countryNames["${country}"] is empty`, 'gray'));
        });
        if (langIssues.emptyCountries.length > 3) {
          console.log(colorize(`      ... and ${langIssues.emptyCountries.length - 3} more`, 'gray'));
        }
      }
    } else {
      console.log(colorize(`\n✅ ${lang}.json`, 'green'));
      const cityCount = langData.cities.cityNames ? Object.keys(langData.cities.cityNames).length : 0;
      const countryCount = langData.cities.countryNames ? Object.keys(langData.cities.countryNames).length : 0;
      console.log(colorize(`   ✓ All ${cityCount} cities translated`, 'green'));
      console.log(colorize(`   ✓ All ${countryCount} countries translated`, 'green'));
    }
  }

  console.log(colorize('\n' + '=' .repeat(80), 'gray'));

  if (hasErrors) {
    console.log(colorize('\n📋 Summary:', 'cyan'));
    console.log(colorize(`   ❌ Found translation issues in ${Object.keys(issues).length} language file(s)`, 'red'));

    // Provide helpful information
    console.log(colorize('\n💡 How to fix:', 'yellow'));
    console.log(colorize('   1. Ensure all cities from metadata.ts have translations in cityNames', 'gray'));
    console.log(colorize('   2. Ensure all countries used by cities have translations in countryNames', 'gray'));
    console.log(colorize('   3. Check that no translation values are empty strings', 'gray'));

    // Show which cities are expected
    if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
      console.log(colorize('\n📍 Expected city keys:', 'cyan'));
      console.log(colorize(cityKeys.join(', '), 'gray'));

      console.log(colorize('\n🌍 Expected countries:', 'cyan'));
      console.log(colorize(countries.join(', '), 'gray'));
    } else {
      console.log(colorize('\n   Use --verbose or -v to see the full list of expected cities and countries', 'gray'));
    }

    process.exit(1);
  } else {
    console.log(colorize('\n🎉 All city and country translations are complete and valid!', 'green'));
    console.log(colorize(`   ✅ ${cityKeys.length} cities properly translated in all languages`, 'green'));
    console.log(colorize(`   ✅ ${countries.length} countries properly translated in all languages`, 'green'));
  }
}

// Cross-reference check: ensure metadata cities match what's actually used
function crossReferenceCheck() {
  if (!process.argv.includes('--cross-check')) {
    return;
  }

  console.log(colorize('\n\n🔍 Cross-Reference Check', 'cyan'));
  console.log(colorize('=' .repeat(80), 'gray'));

  const translations = loadTranslations();
  const { cities } = extractCitiesData();
  const metadataCities = Object.keys(cities);

  // Check if any translation file has cities not in metadata
  for (const [lang, data] of Object.entries(translations)) {
    if (data.cities?.cityNames) {
      const translationCities = Object.keys(data.cities.cityNames);
      const extraCities = translationCities.filter(city => !metadataCities.includes(city));

      if (extraCities.length > 0) {
        console.log(colorize(`\n⚠️  ${lang}.json has ${extraCities.length} cities not in metadata:`, 'yellow'));
        extraCities.forEach(city => {
          console.log(colorize(`   - ${city}`, 'gray'));
        });
      }
    }
  }

  console.log(colorize('\n   This check helps identify obsolete translations', 'gray'));
}

// Main execution
function main() {
  try {
    validateTranslations();
    crossReferenceCheck();
  } catch (error) {
    console.error(colorize(`\n❌ Fatal error: ${error.message}`, 'red'));
    console.error(colorize(error.stack, 'gray'));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateTranslations, extractCitiesData };