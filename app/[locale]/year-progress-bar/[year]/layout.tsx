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

  let description = ""
  if (isCurrentYear) {
    description = `The year ${year} is ${progress.toFixed(2)}% complete with ${timeLeft}. Track the progress in real-time.`
  } else if (isCompleted) {
    description = `The year ${year} is complete. View the progress bar and explore other years.`
  } else {
    description = `The year ${year} hasn't started yet. Explore our year progress tracking tool.`
  }

  if (locale === 'zh-hans') {
    return {
      title: `${year}年进度条 - ${progress.toFixed(2)}% 完成 | Datetime.app`,
      description: `${year}年已经过去${progress.toFixed(2)}%。实时追踪年度进度。`,
      keywords: [`${year}年进度`, `${year}年进度条`, `${year}年剩余时间`, `${year}年追踪`, "时间追踪"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/year-progress-bar/${year}`,
        languages
      },
      openGraph: {
        title: `${year}年进度条 - ${progress.toFixed(2)}% 完成 | Datetime.app`,
        description: `${year}年已经过去${progress.toFixed(2)}%。实时追踪年度进度。`,
        type: "website",
      },
    };
  }

  if (locale === 'zh-hant') {
    return {
      title: `${year}年進度條 - ${progress.toFixed(2)}% 完成 | Datetime.app`,
      description: `${year}年已經過去${progress.toFixed(2)}%。即時追蹤年度進度。`,
      keywords: [`${year}年進度`, `${year}年進度條`, `${year}年剩餘時間`, `${year}年追蹤`, "時間追蹤"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/year-progress-bar/${year}`,
        languages
      },
      openGraph: {
        title: `${year}年進度條 - ${progress.toFixed(2)}% 完成 | Datetime.app`,
        description: `${year}年已經過去${progress.toFixed(2)}%。即時追蹤年度進度。`,
        type: "website",
      },
    };
  }

  return {
    title: `${year} Year Progress Bar - ${progress.toFixed(2)}% Complete | Datetime.app`,
    description,
    keywords: [`${year} progress`, `${year} progress bar`, `time left in ${year}`, `days left in ${year}`, `${year} completion`, `${year} tracker`, "time tracking"],
    alternates: {
      canonical: `https://datetime.app/year-progress-bar/${year}`,
      languages
    },
    openGraph: {
      title: `${year} Year Progress Bar - ${progress.toFixed(2)}% Complete | Datetime.app`,
      description,
      type: "website",
    },
  }
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
