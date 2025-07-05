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
      title: "年度进度条 | 查看当前年度完成百分比 | Datetime.app",
      description: t('description'),
      keywords: ["年度进度", "年度进度条", "年度百分比", "年度完成度", "年度时间线", "年度时间进度"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/year-progress-bar`,
        languages
      },
      openGraph: {
        title: "年度进度条 | 查看当前年度完成百分比 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: "年度進度條 | 查看當前年度完成百分比 | Datetime.app",
      description: t('description'),
      keywords: ["年度進度", "年度進度條", "年度百分比", "年度完成度", "年度時間線", "年度時間進度"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/year-progress-bar`,
        languages
      },
      openGraph: {
        title: "年度進度條 | 查看當前年度完成百分比 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  // For all other non-English locales
  if (locale !== 'en') {
    return {
      title: "Year Progress Bar | See How Much of the Year Has Passed | Datetime.app",
      description: "View the current year's progress with our interactive progress bar. See the exact percentage of the year completed and days remaining.",
      keywords: ["year progress", "year progress bar", "year percentage", "year completion", "year timeline", "year time progress", "days left in year", "days passed in year"],
      alternates: {
        canonical: `https://datetime.app/${locale}/year-progress-bar`,
        languages
      },
      openGraph: {
        title: "Year Progress Bar | See How Much of the Year Has Passed | Datetime.app",
        description: "View the current year's progress with our interactive progress bar. See the exact percentage of the year completed and days remaining.",
        type: "website",
      },
    };
  }
  
  // Default English metadata
  return {
    title: "Year Progress Bar | See How Much of the Year Has Passed | Datetime.app",
    description: "View the current year's progress with our interactive progress bar. See the exact percentage of the year completed and days remaining.",
    keywords: ["year progress", "year progress bar", "year percentage", "year completion", "year timeline", "year time progress", "days left in year", "days passed in year"],
    alternates: {
      canonical: `https://datetime.app/year-progress-bar`,
      languages
    },
    openGraph: {
      title: "Year Progress Bar | See How Much of the Year Has Passed | Datetime.app",
      description: "View the current year's progress with our interactive progress bar. See the exact percentage of the year completed and days remaining.",
      type: "website",
    },
  };
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
