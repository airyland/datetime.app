import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { SUPPORTED_LOCALES } from '@/lib/locales'
import { citiesData } from './metadata'
import CityPageClient from './city-page-client'

export const revalidate = 3600

// Generate supported city/locale combinations on first request.
export function generateStaticParams() {
  return []
}

export default async function CityPage({ params }: {
  params: Promise<{ city: string; locale: string }>
}) {
  const { city, locale } = await params
  if (!SUPPORTED_LOCALES.some(supported => supported === locale) || !Object.hasOwn(citiesData, city)) {
    notFound()
  }
  setRequestLocale(locale)
  return <CityPageClient key={locale + '/' + city} city={city} locale={locale} />
}
