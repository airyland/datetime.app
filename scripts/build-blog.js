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

// Improved markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;

  // Preserve code blocks first
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push('<pre><code>' + escapeHtml(code.trim()) + '</code></pre>');
    return placeholder;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers (shift levels: # becomes h2, ## becomes h3, etc.)
  html = html.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*?)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#### (.*?)$/gm, '<h5>$1</h5>');
  html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links (add nofollow to external links)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Check if it's an external link (not starting with / or #)
    const isExternal = !url.startsWith('/') && !url.startsWith('#') && !url.includes('datetime.app');
    const rel = isExternal ? ' rel="nofollow noopener" target="_blank"' : '';
    return `<a href="${url}"${rel}>${text}</a>`;
  });

  // Horizontal rules (but not table separators)
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');

  // Process tables and lists
  const lines = html.split('\n');
  let result = [];
  let inList = false;
  let listType = '';
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Table detection
    if (line.match(/^\|(.+)\|$/)) {
      // Check if it's a separator line (contains only |, -, :, and spaces)
      // A separator line has cells that only contain -, :, and spaces
      const cells = line.split('|').slice(1, -1);
      const isSeparator = cells.every(cell => /^[\s\-:]+$/.test(cell));

      if (!inTable && !isSeparator) {
        // Start of table
        inTable = true;
        tableRows = [];
      }

      if (inTable) {
        if (!isSeparator) {
          // Parse table row
          const parsedCells = cells.map(cell => cell.trim());
          tableRows.push(parsedCells);
        }

        // Check if next line is not a table row (end of table)
        if (i + 1 >= lines.length || !lines[i + 1].match(/^\|(.+)\|$/)) {
          // Build HTML table
          let tableHtml = '<table>\n';

          if (tableRows.length > 0) {
            // First row is header
            tableHtml += '<thead>\n<tr>\n';
            tableRows[0].forEach(cell => {
              tableHtml += `<th>${cell}</th>\n`;
            });
            tableHtml += '</tr>\n</thead>\n';

            // Remaining rows are body
            if (tableRows.length > 1) {
              tableHtml += '<tbody>\n';
              for (let j = 1; j < tableRows.length; j++) {
                tableHtml += '<tr>\n';
                tableRows[j].forEach(cell => {
                  tableHtml += `<td>${cell}</td>\n`;
                });
                tableHtml += '</tr>\n';
              }
              tableHtml += '</tbody>\n';
            }
          }

          tableHtml += '</table>';
          result.push(tableHtml);

          inTable = false;
          tableRows = [];
        }
        continue;
      }
    }

    // Unordered list
    if (line.match(/^[\*\-] (.+)$/)) {
      const content = line.replace(/^[\*\-] (.+)$/, '$1');
      if (!inList || listType !== 'ul') {
        if (inList) result.push('</' + listType + '>');
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push('<li>' + content + '</li>');
    }
    // Ordered list
    else if (line.match(/^\d+\. (.+)$/)) {
      const content = line.replace(/^\d+\. (.+)$/, '$1');
      if (!inList || listType !== 'ol') {
        if (inList) result.push('</' + listType + '>');
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push('<li>' + content + '</li>');
    }
    // End of list
    else {
      if (inList && line.trim() === '') {
        result.push('</' + listType + '>');
        inList = false;
        listType = '';
      }
      result.push(line);
    }
  }

  if (inList) {
    result.push('</' + listType + '>');
  }

  html = result.join('\n');

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    block = block.trim();
    if (block && !block.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div|p|table|__CODE_BLOCK_)/)) {
      return '<p>' + block.replace(/\n/g, ' ') + '</p>';
    }
    return block;
  }).filter(b => b).join('\n\n');

  // Restore code blocks
  codeBlocks.forEach((code, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, code);
  });

  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
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