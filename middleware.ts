import createMiddleware from 'next-intl/middleware'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}