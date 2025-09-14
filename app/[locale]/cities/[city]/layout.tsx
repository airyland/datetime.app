import { citiesData } from './metadata'
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { city: string; locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps) {
  const city = params.city;
  const locale = params.locale;
  const cityInfo = citiesData[city as keyof typeof citiesData];

  if (!cityInfo) return {};

  const t = await getTranslations({ locale, namespace: 'cities' });

  // Get localized city and country names
  const getLocalizedCityName = (cityKey: string) => {
    try {
      return t(`cityNames.${cityKey}`);
    } catch {
      return cityInfo.name;
    }
  };

  const getLocalizedCountryName = (countryName: string) => {
    try {
      return t(`countryNames.${countryName}`);
    } catch {
      return countryName;
    }
  };

  const localizedCityName = getLocalizedCityName(city);
  const localizedCountryName = getLocalizedCountryName(cityInfo.country);

  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/cities/${city}`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/cities/${city}`;
    }
    return acc;
  }, {} as Record<string, string>);

  // Generate canonical URL
  const canonical = locale === 'en'
    ? `https://datetime.app/cities/${city}`
    : `https://datetime.app/${locale}/cities/${city}`;

  // Use translation templates for metadata
  const title = t('metaTitle', {
    cityName: localizedCityName,
    countryName: localizedCountryName
  });

  const description = t('metaDescription', {
    cityName: localizedCityName,
    countryName: localizedCountryName,
    timezone: cityInfo.timezone
  });

  return {
    title,
    description,
    alternates: {
      canonical,
      languages
    }
  };
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
