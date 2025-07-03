import { timezones } from '../config'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { timezone: string; locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps) {
  const timezone = params.timezone;
  const locale = params.locale;
  const timezoneConfig = timezones.find(tz => tz.slug === timezone);
  
  if (!timezoneConfig) return {};
  
  const t = await getTranslations({ locale, namespace: 'timezones' });
  
  // Get localized timezone name and description
  const timezoneName = t(`names.${timezoneConfig.slug}`);
  const timezoneDescription = t(`descriptions.${timezoneConfig.slug}`);
  
  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/timezones/${timezone}`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/timezones/${timezone}`;
    }
    return acc;
  }, {} as Record<string, string>);
  
  const title = t('title', { timezone: timezoneName });
  const description = t('subtitle', { description: timezoneDescription });
  const canonicalUrl = locale === 'en' 
    ? `https://datetime.app/timezones/${timezone}`
    : `https://datetime.app/${locale}/timezones/${timezone}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export async function generateStaticParams() {
  return timezones.map((timezone) => ({
    timezone: timezone.slug,
  }));
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}