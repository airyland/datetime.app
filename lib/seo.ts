import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/locales"

const BASE = "https://datetime.app"
const url = (locale: string, path: string) => (locale === DEFAULT_LOCALE ? `${BASE}/${path}` : `${BASE}/${locale}/${path}`)

/** canonical + hreflang alternates for a locale-prefixed page, same shape as the utc/cities pages. */
export function pageAlternates(path: string, locale: string) {
  return {
    canonical: url(locale, path),
    languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, url(l, path)])) as Record<string, string>,
  }
}

/** Default social share image (1200x630). Regenerate with `node scripts/generate-og.js`. */
export const OG_IMAGES = [{ url: "https://datetime.app/og.png", width: 1200, height: 630, alt: "datetime.app" }]
export const TWITTER_IMAGES = ["https://datetime.app/og.png"]
