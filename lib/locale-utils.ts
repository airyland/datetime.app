/**
 * Get locale-aware path for navigation
 * @param path - The path to convert
 * @param locale - The current locale
 * @returns The locale-aware path
 */
export function getLocalePath(path: string, locale: string): string {
  return locale === 'en' ? path : `/${locale}${path}`
}

/**
 * Get current locale from pathname
 * @param pathname - The current pathname
 * @returns The current locale
 */
export function getCurrentLocale(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean)
  const locales = ['zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']
  if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
    return pathSegments[0]
  }
  return 'en'
}