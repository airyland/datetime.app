import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

// Your website URL
const WEBSITE_URL = 'https://datetime.app';

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
  const citiesFile = path.join(process.cwd(), 'app/cities/[city]/metadata.ts');
  const content = fs.readFileSync(citiesFile, 'utf-8');
  // Simple regex to extract city slugs from the metadata file
  const matches = content.match(/['"]([^'"]+)['"]:\s*{/g);
  if (!matches) return [];
  return matches.map(m => m.match(/['"]([^'"]+)['"]/)?.[1] || '').filter(Boolean);
}

// Load glossary terms
function getGlossaryTerms() {
  const glossaryFile = path.join(process.cwd(), 'app/glossary/glossary-data.ts');
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

  // Add static pages
  for (const page of staticPages) {
    urls.push({
      loc: `${WEBSITE_URL}/${page}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });
  }

  // Add city pages
  const cities = getCities();
  for (const citySlug of cities) {
    urls.push({
      loc: `${WEBSITE_URL}/cities/${citySlug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
  }

  // Add glossary term pages
  const terms = getGlossaryTerms();
  for (const term of terms) {
    urls.push({
      loc: `${WEBSITE_URL}/glossary/${term}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
  }

  // Add holiday pages for each country
  const countries = getCountries();
  for (const countryCode of countries) {
    urls.push({
      loc: `${WEBSITE_URL}/holidays/${countryCode.toLowerCase()}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
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
