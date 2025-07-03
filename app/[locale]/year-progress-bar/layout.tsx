import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'yearProgress' });
  
  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/year-progress-bar`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/year-progress-bar`;
    }
    return acc;
  }, {} as Record<string, string>);
  
  if (locale === 'zh-hans') {
    return {
      title: "年度进度条 | 追踪年度时间进度 | Datetime.app",
      description: t('description'),
      keywords: ["年度进度", "年度进度条", "年度剩余时间", "年度追踪", "时间追踪"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/year-progress-bar`,
        languages
      },
      openGraph: {
        title: "年度进度条 | 追踪年度时间进度 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: "年度進度條 | 追蹤年度時間進度 | Datetime.app",
      description: t('description'),
      keywords: ["年度進度", "年度進度條", "年度剩餘時間", "年度追蹤", "時間追蹤"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/year-progress-bar`,
        languages
      },
      openGraph: {
        title: "年度進度條 | 追蹤年度時間進度 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  // Default English metadata
  return {
    title: "Year Progress Bar | Track How Much of the Year Has Passed | Datetime.app",
    description: "Track the current year's progress with a real-time progress bar. See exactly how much of the year has passed and how much time is left.",
    keywords: ["year progress", "year progress bar", "time left in year", "days left in year", "year completion", "year tracker", "time tracking"],
    alternates: {
      canonical: `https://datetime.app/year-progress-bar`,
      languages
    },
    openGraph: {
      title: "Year Progress Bar | Track How Much of the Year Has Passed | Datetime.app",
      description: "Track the current year's progress with a real-time progress bar. See exactly how much of the year has passed and how much time is left.",
      type: "website",
    },
  };
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
