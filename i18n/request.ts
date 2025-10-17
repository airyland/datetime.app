import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'

export const locales = SUPPORTED_LOCALES

export default getRequestConfig(async ({ locale }) => {
  // If locale is undefined, default to 'en'
  const currentLocale = locale || DEFAULT_LOCALE

  if (!SUPPORTED_LOCALES.includes(currentLocale as typeof SUPPORTED_LOCALES[number])) {
    notFound()
  }

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  }
})