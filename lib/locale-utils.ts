import { DEFAULT_LOCALE, LOCALE_PREFIXES } from './locales'

/**
 * Get locale-aware path for navigation
 * @param path - The path to convert
 * @param locale - The current locale
 * @returns The locale-aware path
 */
export function getLocalePath(path: string, locale: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`
}

/**
 * Get current locale from pathname
 * @param pathname - The current pathname
 * @returns The current locale
 */

export function getCurrentLocale(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])) {
    return pathSegments[0]
  }
  return DEFAULT_LOCALE
}