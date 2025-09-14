import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'ageCalculator' });

  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/age-calculator`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/age-calculator`;
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: t('metaKeywords').split(', '),
    alternates: {
      canonical: locale === 'en'
        ? `https://datetime.app/age-calculator`
        : `https://datetime.app/${locale}/age-calculator`,
      languages
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: "website",
    },
  };
}

export default function AgeCalculatorLayout({ children }: LayoutProps) {
  return <>{children}</>
}
