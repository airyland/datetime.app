import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getTimezoneById } from '@/lib/iana-timezones'
import { notFound } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  params: { locale: string; timezoneId: string }
}

export async function generateMetadata({ params }: { params: { locale: string; timezoneId: string } }): Promise<Metadata> {
  const timezoneId = decodeURIComponent(params.timezoneId)
  const timezone = getTimezoneById(timezoneId)
  
  if (!timezone) {
    notFound()
  }
  
  const t = await getTranslations({ locale: params.locale, namespace: 'timezoneDetail' })
  
  // Check if we should show timezone ID
  const showTimezoneId = timezone.name.toLowerCase() !== timezone.id.toLowerCase() && 
                         !timezone.id.toLowerCase().includes(timezone.name.toLowerCase()) &&
                         !timezone.name.toLowerCase().includes(timezone.id.split('/').pop()?.toLowerCase() || '')
  
  const timezoneDisplayName = showTimezoneId ? `${timezone.name} (${timezone.id})` : timezone.name
  const title = `${timezoneDisplayName} (${timezone.abbreviation}) - Current Time in ${timezone.city}, ${timezone.country}`
  const description = t('description', { 
    timezone: timezoneDisplayName, 
    city: timezone.city 
  })
  
  return {
    title,
    description,
    keywords: [
      timezone.name,
      timezone.city,
      timezone.country,
      timezone.abbreviation,
      timezone.id,
      'current time',
      'timezone',
      'UTC offset',
      'world clock',
      'time zone converter'
    ].join(', '),
    alternates: {
      canonical: params.locale === 'en' 
        ? `https://datetime.app/iana-timezones/${encodeURIComponent(timezoneId)}`
        : `https://datetime.app/${params.locale}/iana-timezones/${encodeURIComponent(timezoneId)}`,
      languages: {
        'en': `https://datetime.app/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'zh-hans': `https://datetime.app/zh-hans/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'zh-hant': `https://datetime.app/zh-hant/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'ar': `https://datetime.app/ar/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'de': `https://datetime.app/de/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'es': `https://datetime.app/es/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'fr': `https://datetime.app/fr/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'hi': `https://datetime.app/hi/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'it': `https://datetime.app/it/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'ja': `https://datetime.app/ja/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'ko': `https://datetime.app/ko/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'pt': `https://datetime.app/pt/iana-timezones/${encodeURIComponent(timezoneId)}`,
        'ru': `https://datetime.app/ru/iana-timezones/${encodeURIComponent(timezoneId)}`
      }
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Datetime.app'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    other: {
      'timezone:name': timezone.name,
      'timezone:id': timezone.id,
      'timezone:offset': timezone.utcOffset,
      'timezone:city': timezone.city,
      'timezone:country': timezone.country
    }
  }
}

export default function TimezoneDetailLayout({ children }: LayoutProps) {
  return children
}