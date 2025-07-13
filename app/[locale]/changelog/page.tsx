import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Wrench, Bug, Zap } from "lucide-react"

interface ChangelogPageProps {
  params: { locale: string }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
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
      title: 'Changelog - Datetime.app',
      description: 'Stay up to date with the latest features, improvements, and bug fixes to Datetime.app.',
      type: 'website',
      siteName: 'Datetime.app'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Changelog - Datetime.app',
      description: 'Stay up to date with the latest features, improvements, and bug fixes to Datetime.app.'
    }
  }
}

interface ChangelogEntry {
  date: string
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed'
    description: string
  }[]
}

const changelog: ChangelogEntry[] = [
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

const getChangeIcon = (type: string) => {
  switch (type) {
    case 'added':
      return <Plus className="w-4 h-4 text-green-600" />
    case 'changed':
      return <Wrench className="w-4 h-4 text-blue-600" />
    case 'fixed':
      return <Bug className="w-4 h-4 text-red-600" />
    case 'removed':
      return <Zap className="w-4 h-4 text-orange-600" />
    default:
      return null
  }
}

const getChangeBadgeColor = (type: string) => {
  switch (type) {
    case 'added':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'changed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'fixed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'removed':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function ChangelogPage({ params }: ChangelogPageProps) {
  const locale = params.locale
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" title="Go to homepage">
          Datetime.app
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href={locale === 'en' ? '/' : `/${locale}`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
            title="Back to homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and bug fixes to Datetime.app. 
            All notable changes to this project are documented here.
          </p>
        </div>

        {/* Changelog Entries */}
        <div className="max-w-4xl mx-auto space-y-8">
          {changelog.map((entry, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entry.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start gap-3">
                      {getChangeIcon(change.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getChangeBadgeColor(change.type)}`}
                          >
                            {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">About This Changelog</h3>
          <p className="text-sm text-muted-foreground mb-2">
            This changelog follows the{' '}
            <a 
              href="https://keepachangelog.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Keep a Changelog
            </a>{' '}
            format and{' '}
            <a 
              href="https://semver.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Semantic Versioning
            </a>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Plus className="w-3 h-3 text-green-600" />
              <span><strong>Added</strong> for new features</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-3 h-3 text-blue-600" />
              <span><strong>Changed</strong> for changes in existing functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <Bug className="w-3 h-3 text-red-600" />
              <span><strong>Fixed</strong> for bug fixes</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-orange-600" />
              <span><strong>Removed</strong> for removed features</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}