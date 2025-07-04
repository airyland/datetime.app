import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'
import { getMonthNames } from '@/lib/calendar'

interface LayoutProps {
  params: { year: string; month: string; locale: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const year = parseInt(params.year)
  const month = parseInt(params.month)
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'calendar' });

  // Handle invalid year or month
  if (isNaN(year) || year < 1970 || year > 2100 || isNaN(month) || month < 1 || month > 12) {
    return {
      title: "Invalid Date | Calendar | Datetime.app",
      description: "The requested date is invalid. Please select a valid year and month.",
    }
  }

  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/calendar/${year}/${String(month).padStart(2, '0')}`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/calendar/${year}/${String(month).padStart(2, '0')}`;
    }
    return acc;
  }, {} as Record<string, string>);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const isCurrentMonth = year === currentYear && month === currentMonth;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
  // Get localized month names
  const monthNames = getMonthNames(locale);
  const monthName = monthNames.full[month - 1];

  if (locale === 'zh-hans') {
    return {
      title: `${year}年${month}月日历 | ${monthName} ${year} | Datetime.app`,
      description: `查看${year}年${month}月（${monthName}）完整日历，包含所有日期和星期信息。${isCurrentMonth ? '当前月份。' : ''}`,
      keywords: [`${year}年${month}月`, `${monthName} ${year}`, "月历", "日历", "日期查询"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/calendar/${year}/${String(month).padStart(2, '0')}`,
        languages
      },
      openGraph: {
        title: `${year}年${month}月日历 | ${monthName} ${year} | Datetime.app`,
        description: `查看${year}年${month}月（${monthName}）完整日历。`,
        type: "website",
      },
    };
  }

  if (locale === 'zh-hant') {
    return {
      title: `${year}年${month}月日曆 | ${monthName} ${year} | Datetime.app`,
      description: `查看${year}年${month}月（${monthName}）完整日曆，包含所有日期和星期資訊。${isCurrentMonth ? '當前月份。' : ''}`,
      keywords: [`${year}年${month}月`, `${monthName} ${year}`, "月曆", "日曆", "日期查詢"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/calendar/${year}/${String(month).padStart(2, '0')}`,
        languages
      },
      openGraph: {
        title: `${year}年${month}月日曆 | ${monthName} ${year} | Datetime.app`,
        description: `查看${year}年${month}月（${monthName}）完整日曆。`,
        type: "website",
      },
    };
  }

  return {
    title: `${monthName} ${year} Calendar | Monthly View | Datetime.app`,
    description: `View the complete calendar for ${monthName} ${year} with all dates and week information. ${isCurrentMonth ? 'Current month.' : ''}`,
    keywords: [`${monthName} ${year}`, "monthly calendar", "calendar view", "date lookup", month.toString().padStart(2, '0')],
    alternates: {
      canonical: locale === 'en' 
        ? `https://datetime.app/calendar/${year}/${String(month).padStart(2, '0')}`
        : `https://datetime.app/${locale}/calendar/${year}/${String(month).padStart(2, '0')}`,
      languages
    },
    openGraph: {
      title: `${monthName} ${year} Calendar | Monthly View | Datetime.app`,
      description: `View the complete calendar for ${monthName} ${year}.`,
      type: "website",
    },
  }
}

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const params = [];
  
  // Generate pages for current year and next 2 years, all months
  for (let year = currentYear; year <= currentYear + 2; year++) {
    for (let month = 1; month <= 12; month++) {
      params.push({ 
        year: year.toString(), 
        month: String(month).padStart(2, '0')
      });
    }
  }
  
  return params;
}

export default function MonthLayout({ children }: LayoutProps) {
  return <>{children}</>
}