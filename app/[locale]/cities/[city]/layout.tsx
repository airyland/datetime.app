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
    if (locale === 'zh-hans' || locale === 'zh-hant') {
      try {
        return t(`cityNames.${cityKey}`);
      } catch {
        return cityInfo.name;
      }
    }
    return cityInfo.name;
  };
  
  const getLocalizedCountryName = (countryName: string) => {
    if (locale === 'zh-hans' || locale === 'zh-hant') {
      try {
        return t(`countryNames.${countryName}`);
      } catch {
        return countryName;
      }
    }
    return countryName;
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
  
  // Generate localized metadata
  if (locale === 'zh-hans') {
    return {
      title: `${localizedCityName}时间 | ${localizedCityName}当前时间`,
      description: `${localizedCityName}, ${localizedCountryName}的当前本地时间（${cityInfo.timezone}时区）`,
      alternates: {
        canonical: `https://datetime.app/zh-hans/cities/${city}`,
        languages
      }
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: `${localizedCityName}時間 | ${localizedCityName}當前時間`,
      description: `${localizedCityName}, ${localizedCountryName}的當前本地時間（${cityInfo.timezone}時區）`,
      alternates: {
        canonical: `https://datetime.app/zh-hant/cities/${city}`,
        languages
      }
    };
  }
  
  // For all other non-English locales
  if (locale !== 'en') {
    return {
      title: `Current Time in ${cityInfo.name}, ${cityInfo.country} | Datetime.app`,
      description: `Current local time in ${cityInfo.name}, ${cityInfo.country} (${cityInfo.timezone} time zone)`,
      alternates: {
        canonical: `https://datetime.app/${locale}/cities/${city}`,
        languages
      }
    };
  }
  
  // Default English metadata
  return {
    title: `Current Time in ${cityInfo.name}, ${cityInfo.country} | Datetime.app`,
    description: `Current local time in ${cityInfo.name}, ${cityInfo.country} (${cityInfo.timezone} time zone)`,
    alternates: {
      canonical: `https://datetime.app/cities/${city}`,
      languages
    }
  };
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
