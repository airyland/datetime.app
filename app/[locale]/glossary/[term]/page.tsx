import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Book, ExternalLink } from "lucide-react"

interface TermPageProps {
  params: { term: string; locale: string }
}

// Generate metadata
export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { term, locale } = params
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
  const { term, locale } = params
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
    <p key={index} className="mb-4">{paragraph}</p>
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
  
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />

      <div className="container mx-auto px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href={`/${locale === 'en' ? '' : locale + '/'}glossary`}
              className="inline-flex items-center text-primary hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('title')}
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {shortDescription}
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              {formattedDescription}
            </div>
          </div>
          
          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {t('relatedTerms')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((relatedTerm) => (
                    <Link
                      key={relatedTerm}
                      href={`/${locale === 'en' ? '' : locale + '/'}glossary/${relatedTerm}`}
                      className="px-3 py-1 bg-accent/50 hover:bg-accent rounded-full text-sm transition-colors"
                    >
                      {t(`terms.${relatedTerm}.title`)}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
