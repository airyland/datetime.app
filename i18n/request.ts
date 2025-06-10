import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['en', 'zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, default to 'en'
  const currentLocale = locale || 'en'
  
  if (!locales.includes(currentLocale as any)) {
    notFound()
  }

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  }
})