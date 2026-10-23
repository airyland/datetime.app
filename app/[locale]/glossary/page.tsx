import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import GlossaryClient from "./glossary-client"
import { PageIntro } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossary' })

  const canonicalUrl = locale === 'en' 
    ? 'https://datetime.app/glossary'
    : `https://datetime.app/${locale}/glossary`

  return {
    title: `${t('title')} | Datetime.app`,
    description: t('subtitle'),
    keywords: ["datetime glossary", "time terminology", "UTC", "GMT", "timezone", "ISO 8601", "Unix timestamp", "atomic time", "leap second", "time concepts"],
    openGraph: {
    images: OG_IMAGES,
      title: `${t('title')} | Datetime.app`,
      description: t('subtitle'),
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl
    }
  }
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossary' })
  
  // Prepare translations for client component
  const translations = {
    searchPlaceholder: t('searchPlaceholder'),
    searchResults: t('searchResults'),
    noResults: t('noResults'),
    allTerms: t('allTerms'),
    categories: {
      standard: t('categories.standard'),
      format: t('categories.format'),
      concept: t('categories.concept'),
      timezone: t('categories.timezone'),
      calculation: t('categories.calculation'),
    }
  }
  
  // Prepare glossary items with translations
  const glossaryItems = {
    utc: {
      id: 'utc',
      title: t('terms.utc.title'),
      shortDescription: t('terms.utc.shortDescription'),
      category: 'standard'
    },
    gmt: {
      id: 'gmt',
      title: t('terms.gmt.title'),
      shortDescription: t('terms.gmt.shortDescription'),
      category: 'standard'
    },
    iso8601: {
      id: 'iso8601',
      title: t('terms.iso8601.title'),
      shortDescription: t('terms.iso8601.shortDescription'),
      category: 'format'
    },
    unixTimestamp: {
      id: 'unixTimestamp',
      title: t('terms.unixTimestamp.title'),
      shortDescription: t('terms.unixTimestamp.shortDescription'),
      category: 'format'
    },
    timezone: {
      id: 'timezone',
      title: t('terms.timezone.title'),
      shortDescription: t('terms.timezone.shortDescription'),
      category: 'concept'
    },
    dst: {
      id: 'dst',
      title: t('terms.dst.title'),
      shortDescription: t('terms.dst.shortDescription'),
      category: 'concept'
    },
    leapSecond: {
      id: 'leapSecond',
      title: t('terms.leapSecond.title'),
      shortDescription: t('terms.leapSecond.shortDescription'),
      category: 'calculation'
    },
    atomicTime: {
      id: 'atomicTime',
      title: t('terms.atomicTime.title'),
      shortDescription: t('terms.atomicTime.shortDescription'),
      category: 'standard'
    },
    julianDate: {
      id: 'julianDate',
      title: t('terms.julianDate.title'),
      shortDescription: t('terms.julianDate.shortDescription'),
      category: 'format'
    },
    epoch: {
      id: 'epoch',
      title: t('terms.epoch.title'),
      shortDescription: t('terms.epoch.shortDescription'),
      category: 'concept'
    }
  }

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: t('title') }]}
        eyebrow="Reference"
        title={t('title')}
        description={t('subtitle')}
      />
      <GlossaryClient
        locale={locale}
        translations={translations}
        glossaryItems={glossaryItems}
      />
      <div className="h-[clamp(56px,8vw,96px)]" />
    </main>
  )
}
