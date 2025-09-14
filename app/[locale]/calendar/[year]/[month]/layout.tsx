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

  const currentMonthSuffix = isCurrentMonth ? ` ${t('currentMonth')}.` : '';

  return {
    title: t('monthMetaTitle', { monthName, year, month }),
    description: t('monthMetaDescription', { year, month, monthName, currentMonthSuffix }),
    keywords: t('monthMetaKeywords', { year, month, monthName }).split(', '),
    alternates: {
      canonical: locale === 'en'
        ? `https://datetime.app/calendar/${year}/${String(month).padStart(2, '0')}`
        : `https://datetime.app/${locale}/calendar/${year}/${String(month).padStart(2, '0')}`,
      languages
    },
    openGraph: {
      title: t('monthMetaTitle', { monthName, year, month }),
      description: t('monthMetaDescription', { year, month, monthName, currentMonthSuffix }),
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