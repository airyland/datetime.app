import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { PageIntro, Section, cardClass, monoLabel } from "@/components/ds"
import { getLocalePath } from "@/lib/locale-utils"

interface TermPageProps {
  params: Promise<{ term: string; locale: string }>
}

// Generate metadata
export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { term, locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossary' })
  
  // Check if term exists
  const termKey = `terms.${term}`
  try {
    const title = t(`${termKey}.title`)
    const description = t(`${termKey}.shortDescription`)
    
    const canonicalUrl = locale === 'en' 
      ? `https://datetime.app/glossary/${term}`
      : `https://datetime.app/${locale}/glossary/${term}`
    
    return {
      title: `${title} | ${t('title')} | Datetime.app`,
      description: description,
      keywords: [term, "datetime", "time", "terminology", title.toLowerCase()],
      openGraph: {
        title: `${title} | ${t('title')} | Datetime.app`,
        description: description,
        type: "article",
      },
      alternates: {
        canonical: canonicalUrl
      }
    }
  } catch {
    return {
      title: `Term Not Found | ${t('title')} | Datetime.app`,
      description: t('subtitle'),
    }
  }
}

export default async function TermPage({ params }: TermPageProps) {
  const { term, locale } = await params
  const t = await getTranslations({ locale, namespace: 'glossary' })
  
  // Define available terms
  const availableTerms = ['utc', 'gmt', 'iso8601', 'unixTimestamp', 'timezone', 'dst', 'leapSecond', 'atomicTime', 'julianDate', 'epoch']
  
  // If term doesn't exist, show 404
  if (!availableTerms.includes(term)) {
    notFound()
  }
  
  // Get term information from translations
  const termKey = `terms.${term}`
  const title = t(`${termKey}.title`)
  const shortDescription = t(`${termKey}.shortDescription`)
  const longDescription = t(`${termKey}.longDescription`)
  
  // Format the long description with paragraphs
  const formattedDescription = longDescription.split('\n\n').map((paragraph, index) => (
    <p key={index} className="m-0 mb-[18px]">{paragraph}</p>
  ))
  
  // Define related terms for each term (simplified for now)
  const relatedTermsMap: Record<string, string[]> = {
    utc: ['gmt', 'atomicTime', 'leapSecond', 'timezone'],
    gmt: ['utc', 'timezone'],
    iso8601: ['utc', 'unixTimestamp'],
    unixTimestamp: ['epoch', 'utc', 'iso8601'],
    timezone: ['utc', 'dst'],
    dst: ['timezone'],
    leapSecond: ['utc', 'atomicTime'],
    atomicTime: ['utc', 'leapSecond'],
    julianDate: ['epoch'],
    epoch: ['unixTimestamp', 'julianDate']
  }
  
  const relatedTerms = relatedTermsMap[term] || []
  
  const categoryMap: Record<string, string> = {
    utc: 'standard', gmt: 'standard', atomicTime: 'standard',
    iso8601: 'format', unixTimestamp: 'format', julianDate: 'format',
    timezone: 'concept', dst: 'concept', epoch: 'concept',
    leapSecond: 'calculation',
  }
  const glossaryHref = `/${locale === 'en' ? '' : locale + '/'}glossary`
  const catLabel = t(`categories.${categoryMap[term]}`)

  return (
    <main>
      <PageIntro
        crumbs={[
          { label: "Home", href: getLocalePath("/", locale) },
          { label: t('title'), href: glossaryHref },
          { label: title },
        ]}
        eyebrow={catLabel}
        title={title}
        description={shortDescription}
      />

      <Section top="clamp(8px,2vw,24px)">
        <div className="flex flex-wrap items-start gap-3.5">
          <article className={`${cardClass} min-w-0 flex-[2_1_460px] p-[clamp(24px,3.4vw,44px)]`}>
            <div className={monoLabel}>{title}</div>
            <div className="mt-5 max-w-[68ch] text-[16.5px] leading-[1.8]">
              {formattedDescription}
            </div>
          </article>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <div className={`${cardClass} cl overflow-hidden`}>
                <h2 className="m-0 px-[22px] pb-3.5 pt-5 text-lg font-semibold tracking-[-0.02em]">{t('relatedTerms')}</h2>
                {relatedTerms.map((relatedTerm) => (
                  <Link
                    key={relatedTerm}
                    href={`/${locale === 'en' ? '' : locale + '/'}glossary/${relatedTerm}`}
                    title={t(`terms.${relatedTerm}.title`)}
                    className="group flex items-center justify-between gap-3 border-t border-line px-[22px] py-3.5 transition-colors hover:bg-paper"
                  >
                    <span className="text-[15px] font-medium">{t(`terms.${relatedTerm}.title`)}</span>
                    <span aria-hidden="true" className="text-subtle transition-all group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-brand">↗</span>
                  </Link>
                ))}
              </div>
            )}
            <div className={`${cardClass} px-[22px] py-5`}>
              <div className={monoLabel}>{t('title')}</div>
              <div className="mt-3 text-[17px] font-medium tracking-[-0.015em]">{catLabel}</div>
            </div>
          </aside>
        </div>

        <div className="mt-7 pb-[clamp(56px,8vw,96px)]">
          <Link href={glossaryHref} title={t('title')} className="text-[14.5px] text-subtle transition-colors hover:text-ink">
            ← {t('title')}
          </Link>
        </div>
      </Section>
    </main>
  )
}
