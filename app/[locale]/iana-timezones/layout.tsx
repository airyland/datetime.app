import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface LayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'ianaTimezones' })
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'IANA timezone',
      'timezone database',
      'world time zones',
      'UTC offset',
      'time zone converter',
      'international time',
      'timezone list',
      'time zone information',
      'global timezones',
      'timezone search'
    ].join(', '),
    alternates: {
      canonical: params.locale === 'en' 
        ? 'https://datetime.app/iana-timezones'
        : `https://datetime.app/${params.locale}/iana-timezones`,
      languages: {
        'en': 'https://datetime.app/iana-timezones',
        'zh-hans': 'https://datetime.app/zh-hans/iana-timezones',
        'zh-hant': 'https://datetime.app/zh-hant/iana-timezones',
        'ar': 'https://datetime.app/ar/iana-timezones',
        'de': 'https://datetime.app/de/iana-timezones',
        'es': 'https://datetime.app/es/iana-timezones',
        'fr': 'https://datetime.app/fr/iana-timezones',
        'hi': 'https://datetime.app/hi/iana-timezones',
        'it': 'https://datetime.app/it/iana-timezones',
        'ja': 'https://datetime.app/ja/iana-timezones',
        'ko': 'https://datetime.app/ko/iana-timezones',
        'pt': 'https://datetime.app/pt/iana-timezones',
        'ru': 'https://datetime.app/ru/iana-timezones'
      }
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: 'Datetime.app'
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  }
}

export default function IANATimezonesLayout({ children }: LayoutProps) {
  return children
}