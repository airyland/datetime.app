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
  'holidays',
  'glossary'
];

interface SitemapURL {
  loc: string;
  lastmod: string;
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

// Load glossary terms
function getGlossaryTerms() {
  const glossaryFile = path.join(process.cwd(), 'app/[locale]/glossary/glossary-data.ts');
  const content = fs.readFileSync(glossaryFile, 'utf-8');
  // Simple regex to extract term IDs from the glossary data file
  const matches = content.match(/['"]([^'"]+)['"]:\s*{[^}]*id:\s*['"]([^'"]+)['"]/g);
  if (!matches) return [];
  return matches.map(m => m.match(/id:\s*['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
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
  const currentDate = new Date().toISOString();

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
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '1.0' : '0.9'
      });
    }
  }

  // Add city pages for all locales
  const cities = getCities();
  for (const locale of locales) {
    for (const citySlug of cities) {
      urls.push({
        loc: getLocalizedURL(locale, `cities/${citySlug}`),
        lastmod: currentDate,
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
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.8' : '0.7'
      });
    }
  }

  // Add holiday pages for each country and locale
  const countries = getCountries();
  for (const locale of locales) {
    for (const countryCode of countries) {
      urls.push({
        loc: getLocalizedURL(locale, `holidays/${countryCode.toLowerCase()}`),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.8' : '0.7'
      });
    }
  }

  // Add year progress pages for current and next year
  const currentYear = new Date().getFullYear();
  for (const locale of locales) {
    for (const year of [currentYear, currentYear + 1]) {
      urls.push({
        loc: getLocalizedURL(locale, `year-progress-bar/${year}`),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: locale === defaultLocale ? '0.6' : '0.5'
      });
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
          <lastmod>${url.lastmod}</lastmod>
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
