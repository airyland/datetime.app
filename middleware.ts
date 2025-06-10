import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}