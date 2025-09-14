const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'blog');
const outputDir = path.join(process.cwd(), 'data', 'blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Simple frontmatter parser
function parseFrontmatter(content) {
  const lines = content.split('\n');
  const frontmatter = {};
  let inFrontmatter = false;
  let contentStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }

    if (inFrontmatter && line === '---') {
      contentStartIndex = i + 1;
      break;
    }

    if (inFrontmatter) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();

        // Handle arrays (tags)
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
        } else {
          // Remove quotes if present
          value = value.replace(/^["']|["']$/g, '');
        }

        frontmatter[key] = value;
      }
    }
  }

  const markdownContent = lines.slice(contentStartIndex).join('\n');
  return { frontmatter, content: markdownContent };
}

// Simple markdown to HTML converter (basic implementation)
function markdownToHtml(markdown) {
  let html = markdown;

  // Headers (shift levels: # becomes h2, ## becomes h3, etc.)
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');

  // Wrap consecutive list items
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>';
  });

  // Paragraphs
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    if (p.trim() && !p.startsWith('<')) {
      return '<p>' + p.trim() + '</p>';
    }
    return p;
  }).join('\n\n');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Line breaks
  html = html.replace(/\n/g, '<br>\n');

  return html;
}

function generateSlug(filename) {
  return filename.replace(/\.md$/, '').toLowerCase();
}

function generateExcerpt(content, maxLength = 150) {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function buildBlog() {
  console.log('Building blog data...');

  // Check if content directory exists
  if (!fs.existsSync(contentDir)) {
    console.log('No blog content found. Creating directory...');
    fs.mkdirSync(contentDir, { recursive: true });
    return;
  }

  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

  const posts = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(fileContent);

    const html = markdownToHtml(content);
    const slug = frontmatter.slug || generateSlug(file);
    const excerpt = frontmatter.description || generateExcerpt(content);
    const readTime = frontmatter.readTime || estimateReadTime(content);

    posts.push({
      slug,
      title: frontmatter.title,
      description: excerpt,
      date: frontmatter.date,
      author: frontmatter.author || 'Site Team',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : []),
      keywords: frontmatter.keywords || '',
      image: frontmatter.image || '/images/blog/default.jpg',
      readTime,
      featured: frontmatter.featured === 'true' || frontmatter.featured === true,
      published: frontmatter.published !== 'false' && frontmatter.published !== false,
      content: html
    });
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write posts data
  fs.writeFileSync(
    path.join(outputDir, 'posts.json'),
    JSON.stringify(posts, null, 2)
  );

  console.log(`Built ${posts.length} blog posts`);

  // Generate RSS feed
  generateRSSFeed(posts);

  // Generate sitemap entries
  generateSitemapEntries(posts);
}

function generateRSSFeed(posts) {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Datetime.app Blog</title>
    <description>Expert insights on timezones, time management, and productivity</description>
    <link>https://datetime.app/blog</link>
    <atom:link href="https://datetime.app/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.filter(p => p.published).slice(0, 20).map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>https://datetime.app/blog/${post.slug}</link>
      <guid>https://datetime.app/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(outputDir, 'rss.xml'), rss);
  console.log('Generated RSS feed');
}

function generateSitemapEntries(posts) {
  const entries = posts.filter(p => p.published).map(post => ({
    url: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: 0.7
  }));

  entries.unshift({
    url: '/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  });

  fs.writeFileSync(
    path.join(outputDir, 'sitemap-entries.json'),
    JSON.stringify(entries, null, 2)
  );
  console.log('Generated sitemap entries');
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Run the build
buildBlog().catch(console.error);