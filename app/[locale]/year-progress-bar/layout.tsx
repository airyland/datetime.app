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

  // Generate canonical URL
  const canonical = locale === 'en'
    ? `https://datetime.app/year-progress-bar`
    : `https://datetime.app/${locale}/year-progress-bar`;

  // Try to get translated metadata or fallback to defaults
  let title: string;
  let description: string;

  try {
    title = t('metaTitle');
    description = t('metaDescription');
  } catch {
    // Fallback if translation keys don't exist yet
    title = t('title') + ' | Datetime.app';
    description = t('description');
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function YearProgressBarLayout({ children }: LayoutProps) {
  return <>{children}</>
}
