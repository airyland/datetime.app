"use client"

import { useEffect } from "react"

const svg = (h: number, m: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">` +
  `<rect width="64" height="64" rx="14" fill="#101114"/>` +
  `<g transform="translate(8 8) scale(2)" stroke-width="1.75" stroke-linecap="round">` +
  `<circle cx="12" cy="12" r="9.25" stroke="#F5F5F2"/>` +
  `<path d="M12 12V6.5" stroke="#F5F5F2" transform="rotate(${m} 12 12)"/>` +
  `<path d="M12 12V7.8" stroke="#FF6A45" transform="rotate(${h} 12 12)"/>` +
  `</g></svg>`

/** Keeps the tab icon's hands on the visitor's local time, like the header logo (BrandMark). */
export function LiveFavicon() {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "icon"
    link.type = "image/svg+xml"
    // Next owns the metadata links. This component only manages its own icon.
    let last = ""
    const tick = () => {
      const d = new Date()
      const m = d.getMinutes() + d.getSeconds() / 60
      const h = ((d.getHours() % 12) + m / 60) * 30
      const href = "data:image/svg+xml," + encodeURIComponent(svg(Math.round(h * 10) / 10, Math.round(m * 6 * 10) / 10))
      if (href !== last) {
        last = href
        link.href = href
      }
    }
    tick()
    document.head.appendChild(link)
    const t = setInterval(tick, 10000)
    return () => {
      clearInterval(t)
      link.remove()
    }
  }, [])
  return null
}
