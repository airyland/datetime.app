// Renders public/og.png (1200x630) from an inline SVG. Run: node scripts/generate-og.js
const sharp = require("sharp")
const path = require("path")

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#101114"/>
  <g stroke="#F5F5F2" stroke-opacity=".07" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`).join("")}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 105}" x2="1200" y2="${i * 105}"/>`).join("")}
  </g>
  <g transform="translate(760 95) scale(14)" fill="none" stroke-width="1.75" stroke-linecap="round">
    <circle cx="12" cy="12" r="9.25" stroke="#F5F5F2"/>
    <path d="M12 6.5V12" stroke="#F5F5F2"/>
    <path d="M12 12l3.6 2.2" stroke="#FF6A45"/>
  </g>
  <rect x="80" y="130" width="40" height="4" rx="2" fill="#FF6A45"/>
  <text x="80" y="300" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="104" font-weight="500" letter-spacing="-4" fill="#F5F5F2">datetime.app</text>
  <text x="80" y="375" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" fill="#F5F5F2" fill-opacity=".62">World clock, time zones, calendars</text>
  <text x="80" y="425" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" fill="#F5F5F2" fill-opacity=".62">and countdowns for every city.</text>
  <text x="80" y="548" font-family="Menlo, Courier New, monospace" font-size="26" letter-spacing="3" fill="#FF6A45">UTC · IANA · UNIX · 14 LANGUAGES</text>
</svg>`

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(__dirname, "..", "public", "og.png"))
  .then((i) => console.log("wrote public/og.png", i.width + "x" + i.height, i.size + "B"))
