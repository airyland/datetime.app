import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { year: string; locale: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const year = parseInt(params.year)
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'calendar' });

  // Handle invalid year
  if (isNaN(year) || year < 1970 || year > 2100) {
    return {
      title: "Invalid Year | Calendar | Datetime.app",
      description: "The requested year is invalid. Please select a valid year between 1970 and 2100.",
    }
  }

  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/calendar/${year}`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/calendar/${year}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const currentYear = new Date().getFullYear();
  const isCurrentYear = year === currentYear;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  if (locale === 'zh-hans') {
    return {
      title: `${year}年日历 | 完整年历视图 | Datetime.app`,
      description: `查看${year}年完整日历，包含所有月份、周数和日期。${isLeapYear ? '闰年' : '平年'}，${isCurrentYear ? '当前年份' : ''}。`,
      keywords: [`${year}年日历`, "年历", "月历", "日期查询", "周数", isLeapYear ? "闰年" : "平年"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/calendar/${year}`,
        languages
      },
      openGraph: {
        title: `${year}年日历 | 完整年历视图 | Datetime.app`,
        description: `查看${year}年完整日历，包含所有月份、周数和日期。`,
        type: "website",
      },
    };
  }

  if (locale === 'zh-hant') {
    return {
      title: `${year}年日曆 | 完整年曆視圖 | Datetime.app`,
      description: `查看${year}年完整日曆，包含所有月份、週數和日期。${isLeapYear ? '閏年' : '平年'}，${isCurrentYear ? '當前年份' : ''}。`,
      keywords: [`${year}年日曆`, "年曆", "月曆", "日期查詢", "週數", isLeapYear ? "閏年" : "平年"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/calendar/${year}`,
        languages
      },
      openGraph: {
        title: `${year}年日曆 | 完整年曆視圖 | Datetime.app`,
        description: `查看${year}年完整日曆，包含所有月份、週數和日期。`,
        type: "website",
      },
    };
  }

  return {
    title: `${year} Calendar | Full Year View | Datetime.app`,
    description: `View the complete ${year} calendar with all months, week numbers, and dates. ${isLeapYear ? 'Leap year' : 'Regular year'}${isCurrentYear ? ' (current year)' : ''}.`,
    keywords: [`${year} calendar`, "yearly calendar", "monthly calendar", "date lookup", "week numbers", isLeapYear ? "leap year" : "regular year"],
    alternates: {
      canonical: locale === 'en' 
        ? `https://datetime.app/calendar/${year}`
        : `https://datetime.app/${locale}/calendar/${year}`,
      languages
    },
    openGraph: {
      title: `${year} Calendar | Full Year View | Datetime.app`,
      description: `View the complete ${year} calendar with all months, week numbers, and dates.`,
      type: "website",
    },
  }
}

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Generate pages for current year ± 5 years
  for (let year = currentYear - 5; year <= currentYear + 5; year++) {
    years.push({ year: year.toString() });
  }
  
  return years;
}

export default function CalendarLayout({ children }: LayoutProps) {
  return <>{children}</>
}