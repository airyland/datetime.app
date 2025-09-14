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

  const yearType = isLeapYear ? t('leapYear') : t('regularYear');
  const currentYearSuffix = isCurrentYear ? ` (${t('currentYear')})` : '';

  return {
    title: t('yearMetaTitle', { year }),
    description: t('yearMetaDescription', { year, yearType, currentYearSuffix }),
    keywords: t('yearMetaKeywords', { year, yearType }).split(', '),
    alternates: {
      canonical: locale === 'en'
        ? `https://datetime.app/calendar/${year}`
        : `https://datetime.app/${locale}/calendar/${year}`,
      languages
    },
    openGraph: {
      title: t('yearMetaTitle', { year }),
      description: t('yearMetaDescription', { year, yearType, currentYearSuffix }),
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