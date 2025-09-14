import { Metadata } from "next"
import { calculateYearProgress, calculateTimeLeft, getYearStatus } from "@/lib/year-progress"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { year: string; locale: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const year = parseInt(params.year)
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'yearProgress' });

  // Handle invalid year
  if (isNaN(year) || year < 1970) {
    return {
      title: "Invalid Year | Year Progress Bar | Datetime.app",
      description: "The requested year is invalid. Please select a valid year after 1970.",
    }
  }

  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/year-progress-bar/${year}`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/year-progress-bar/${year}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const now = new Date()
  const progress = calculateYearProgress(now, year)
  const timeLeft = calculateTimeLeft(now, year)
  const { isCurrentYear, isCompleted, isFuture } = getYearStatus(now, year)

  return {
    title: t('yearMetaTitle', { year, progress: progress.toFixed(2) }),
    description: t('yearMetaDescription', { year, progress: progress.toFixed(2), timeLeft, isCurrentYear, isCompleted, isFuture }),
    keywords: t('yearMetaKeywords', { year }).split(', '),
    alternates: {
      canonical: locale === 'en'
        ? `https://datetime.app/year-progress-bar/${year}`
        : `https://datetime.app/${locale}/year-progress-bar/${year}`,
      languages
    },
    openGraph: {
      title: t('yearMetaTitle', { year, progress: progress.toFixed(2) }),
      description: t('yearMetaDescription', { year, progress: progress.toFixed(2), timeLeft, isCurrentYear, isCompleted, isFuture }),
      type: "website",
    },
  }
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
