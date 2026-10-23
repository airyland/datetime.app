import { Metadata } from 'next'
import { PageIntro, Section, Card } from "@/components/ds"
import ChangelogList from "./changelog-list"
import { getLocalePath } from '@/lib/locale-utils'
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

interface ChangelogPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params: paramsPromise }: ChangelogPageProps): Promise<Metadata> {
  const params = await paramsPromise
  return {
    title: 'Changelog - Datetime.app',
    description: 'Stay up to date with the latest features, improvements, and bug fixes to Datetime.app.',
    keywords: [
      'changelog',
      'updates',
      'new features', 
      'bug fixes',
      'improvements',
      'datetime.app'
    ].join(', '),
    alternates: {
      canonical: params.locale === 'en' 
        ? 'https://datetime.app/changelog'
        : `https://datetime.app/${params.locale}/changelog`
    },
    openGraph: {
    images: OG_IMAGES,
      title: 'Changelog - Datetime.app',
      description: 'Stay up to date with the latest features, improvements, and bug fixes to Datetime.app.',
      type: 'website',
      siteName: 'Datetime.app'
    },
    twitter: {
    images: TWITTER_IMAGES,
      card: 'summary_large_image',
      title: 'Changelog - Datetime.app',
      description: 'Stay up to date with the latest features, improvements, and bug fixes to Datetime.app.'
    }
  }
}

export interface ChangelogEntry {
  date: string
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed'
    description: string
  }[]
}

export const changelog: ChangelogEntry[] = [
  {
    date: '2025-07-12',
    changes: [
      {
        type: 'added',
        description: 'Complete IANA Timezones database with 70+ timezone entries'
      },
      {
        type: 'added', 
        description: 'Interactive timezone list page with search, filtering, and statistics'
      },
      {
        type: 'added',
        description: 'Detailed timezone pages with current time, time formats, and related timezones'
      },
      {
        type: 'added',
        description: 'Comprehensive internationalization (i18n) support for 13 languages'
      },
      {
        type: 'added',
        description: 'Timezone navigation links in header and footer'
      },
      {
        type: 'changed',
        description: 'Improved SEO with proper canonical URLs and language alternates'
      },
      {
        type: 'changed',
        description: 'Enhanced calendar pages with better year overview content'
      },
      {
        type: 'fixed',
        description: 'Canonical URL issues across multiple pages'
      }
    ]
  },
  {
    date: '2025-07-10',
    changes: [
      {
        type: 'added',
        description: 'Year limit settings for calendar generation'
      },
      {
        type: 'added',
        description: 'Internationalization check script for translation validation'
      },
      {
        type: 'changed',
        description: 'Improved timezone display and formatting'
      },
      {
        type: 'changed',
        description: 'Temporarily disabled language suggestion modal'
      }
    ]
  },
  {
    date: '2025-07-05',
    changes: [
      {
        type: 'changed',
        description: 'Updated internationalization files and translations'
      }
    ]
  },
  {
    date: '2025-07-04',
    changes: [
      {
        type: 'added',
        description: 'Timezone timeline feature for better time visualization'
      },
      {
        type: 'added',
        description: 'Monthly calendar view with detailed month information'
      },
      {
        type: 'added',
        description: 'World clock synchronization with timezone data'
      },
      {
        type: 'fixed',
        description: 'UTC page canonical URL issues'
      },
      {
        type: 'fixed',
        description: 'City page canonical URL configuration'
      },
      {
        type: 'changed',
        description: 'Updated UI styles and component designs'
      }
    ]
  },
  {
    date: '2025-07-03',
    changes: [
      {
        type: 'added',
        description: 'Complete calendar system with yearly and monthly views'
      },
      {
        type: 'added',
        description: 'ProductHunt integration and social links'
      },
      {
        type: 'fixed',
        description: 'Sitemap generation and SEO improvements'
      },
      {
        type: 'fixed',
        description: 'Canonical URL structure across the application'
      }
    ]
  },
  {
    date: '2025-07-02',
    changes: [
      {
        type: 'added',
        description: 'Comprehensive timezone support and city-specific time pages'
      },
      {
        type: 'fixed',
        description: 'Sitemap generation process and XML structure'
      }
    ]
  },
  {
    date: '2025-07-01',
    changes: [
      {
        type: 'added',
        description: 'Social media links and GitHub integration'
      },
      {
        type: 'added',
        description: 'City-based internationalization support'
      },
      {
        type: 'fixed',
        description: 'GitHub repository link configuration'
      }
    ]
  },
  {
    date: '2025-06-30',
    changes: [
      {
        type: 'added',
        description: 'Main heading (H1) on homepage for better SEO'
      },
      {
        type: 'changed',
        description: 'Header design and navigation improvements'
      }
    ]
  }
]

export default async function ChangelogPage({ params }: ChangelogPageProps) {
  const { locale } = await params

  return (
    <main>
      <PageIntro
        crumbs={[{ label: 'Home', href: getLocalePath('/', locale) }, { label: 'Changelog' }]}
        eyebrow="Release notes"
        title="Changelog"
        description="Stay up to date with the latest features, improvements, and bug fixes to Datetime.app. All notable changes to this project are documented here."
      />

      <ChangelogList entries={changelog} />

      <Section className="pb-[clamp(56px,8vw,96px)]">
        <Card className="p-6">
          <h2 className="m-0 mb-2 text-lg font-semibold tracking-[-0.02em]">About This Changelog</h2>
          <p className="m-0 text-sm leading-relaxed text-subtle">
            This changelog follows the{' '}
            <a href="https://keepachangelog.com/" target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line2 underline-offset-4 hover:decoration-brand">
              Keep a Changelog
            </a>{' '}
            format and{' '}
            <a href="https://semver.org/" target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line2 underline-offset-4 hover:decoration-brand">
              Semantic Versioning
            </a>.
          </p>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-3 p-0 text-[13px] text-subtle sm:grid-cols-2 lg:grid-cols-4">
            <li><strong className="text-ink">Added</strong> for new features</li>
            <li><strong className="text-ink">Changed</strong> for changes in existing functionality</li>
            <li><strong className="text-ink">Fixed</strong> for bug fixes</li>
            <li><strong className="text-ink">Removed</strong> for removed features</li>
          </ul>
        </Card>
      </Section>
    </main>
  )
}
