import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

// Your website URL
const WEBSITE_URL = 'https://datetime.app';

// Supported locales (English uses default paths without prefix)
const locales = ['en', 'zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru'];
const defaultLocale = 'en';

// Static pages (pages without dynamic routes)
const staticPages = [
  '',  // home page
  'about',
  'age-calculator',
  'utc',
  'year-progress-bar',
  'glossary'
];

// English-only pages
const englishOnlyPages = [
  'holidays'
];

interface SitemapURL {
  loc: string;
  changefreq: string;
  priority: string;
}

// Load cities data
function getCities() {
  const citiesFile = path.join(process.cwd(), 'app/[locale]/cities/[city]/metadata.ts');
  const content = fs.readFileSync(citiesFile, 'utf-8');
  // Simple regex to extract city slugs from the metadata file
  const matches = content.match(/['"]([^'"]+)['"]:\s*{/g);
  if (!matches) return [];
  return matches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
}

// Load glossary terms (English only)
function getGlossaryTerms() {
  const glossaryFile = path.join(process.cwd(), 'app/[locale]/glossary/glossary-data.ts');
  const content = fs.readFileSync(glossaryFile, 'utf-8');
  // Simple regex to extract term IDs from the glossary data file
  const matches = content.match(/['"]([^'"]+)['"]:\s*{[^}]*id:\s*['"]([^'"]+)['"]/g);
  if (!matches) return [];
  return matches.map(m => m.match(/id:\s*['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
}

// Load timezone data
function getTimezones() {
  const timezoneFile = path.join(process.cwd(), 'app/[locale]/timezones/config.ts');
  const content = fs.readFileSync(timezoneFile, 'utf-8');
  // Extract timezone slugs from config
  const matches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
  if (!matches) return [];
  return matches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
}

// Load countries data
function getCountries() {
  const holidaysFile = path.join(process.cwd(), 'lib/holidays.ts');
  const content = fs.readFileSync(holidaysFile, 'utf-8');
  // Extract country codes from the COUNTRIES array
  const matches = content.match(/code:\s*['"]([^'"]+)['"]/g);
  if (!matches) return [];
  return matches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
}

function generateURLs(): SitemapURL[] {
  const urls: SitemapURL[] = [];

  // Helper function to generate URL with locale prefix
  const getLocalizedURL = (locale: string, path: string = '') => {
    if (locale === defaultLocale) {
      // English uses default paths without prefix
      const url = path ? `${WEBSITE_URL}/${path}` : WEBSITE_URL;
      return url.replace(/([^:]\/)\/+/g, '$1');
    } else {
      // Other locales use prefix
      const url = path ? `${WEBSITE_URL}/${locale}/${path}` : `${WEBSITE_URL}/${locale}`;
      return url.replace(/([^:]\/)\/+/g, '$1');
    }
  };

  // Add static pages for all locales
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        loc: getLocalizedURL(locale, page),
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '1.0' : '0.9'
      });
    }
  }

  // Add English-only pages
  for (const page of englishOnlyPages) {
    urls.push({
      loc: getLocalizedURL('en', page),
      changefreq: 'weekly',
      priority: '1.0'
    });
  }

  // Add city pages for all locales
  const cities = getCities();
  for (const locale of locales) {
    for (const citySlug of cities) {
      urls.push({
        loc: getLocalizedURL(locale, `cities/${citySlug}`),
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.8' : '0.7'
      });
    }
  }

  // Add timezone pages for all locales (except UTC which is already in static pages)
  const timezones = getTimezones();
  for (const locale of locales) {
    for (const timezone of timezones) {
      urls.push({
        loc: getLocalizedURL(locale, `timezones/${timezone}`),
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.8' : '0.7'
      });
    }
  }

  // Add glossary term pages for all locales
  const terms = getGlossaryTerms();
  for (const locale of locales) {
    for (const term of terms) {
      urls.push({
        loc: getLocalizedURL(locale, `glossary/${term}`),
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.8' : '0.7'
      });
    }
  }

  // Add holiday pages for English only
  const countries = getCountries();
  for (const countryCode of countries) {
    urls.push({
      loc: getLocalizedURL('en', `holidays/${countryCode.toLowerCase()}`),
      changefreq: 'weekly',
      priority: '0.8'
    });
  }

  // Add year progress pages for current and next year
  const currentYear = new Date().getFullYear();
  for (const locale of locales) {
    for (const year of [currentYear, currentYear + 1]) {
      urls.push({
        loc: getLocalizedURL(locale, `year-progress-bar/${year}`),
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.6' : '0.5'
      });
    }
  }

  // Add calendar pages for current year ± 5 years
  for (const locale of locales) {
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      urls.push({
        loc: getLocalizedURL(locale, `calendar/${year}`),
        changefreq: 'monthly',
        priority: year === currentYear 
          ? (locale === defaultLocale ? '0.8' : '0.7')
          : (locale === defaultLocale ? '0.6' : '0.5')
      });
    }
  }

  // Add monthly calendar pages for current year and next 2 years
  const currentMonth = new Date().getMonth() + 1;
  for (const locale of locales) {
    for (let year = currentYear; year <= currentYear + 2; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthStr = String(month).padStart(2, '0');
        const isCurrentMonth = year === currentYear && month === currentMonth;
        urls.push({
          loc: getLocalizedURL(locale, `calendar/${year}/${monthStr}`),
          changefreq: 'monthly',
          priority: isCurrentMonth
            ? (locale === defaultLocale ? '0.7' : '0.6')
            : (locale === defaultLocale ? '0.5' : '0.4')
        });
      }
    }
  }

  return urls;
}

async function generateSitemap() {
  const urls = generateURLs();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url.loc}</loc>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  const formattedSitemap = await prettier.format(sitemap, {
    parser: 'html',
  });

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    formattedSitemap
  );

  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);
