import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// Predefined list of supported cities with their metadata
export const citiesData = {
  'new-york': {
    name: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    population: '8.5 million',
    coordinates: '40.7128° N, 74.0060° W',
  },
  'london': {
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    population: '9 million',
    coordinates: '51.5074° N, 0.1278° W',
  },
  'tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    population: '14 million',
    coordinates: '35.6762° N, 139.6503° E',
  },
  'shanghai': {
    name: 'Shanghai',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '24 million',
    coordinates: '31.2304° N, 121.4737° E',
  },
  'beijing': {
    name: 'Beijing',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '24 million',
    coordinates: '31.2304° N, 121.4737° E',
  },
  'seoul': {
    name: 'Seoul',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'kolkata': {
    name: 'Kolkata',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'dubai': {
    name: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'cairo': {
    name: 'Cairo',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'moscow': {
    name: 'Moscow',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'istanbul': {
    name: 'Istanbul',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  paris: {
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    population: '9.5 million',
    coordinates: '48.8566° N, 2.3522° E',
  },
  sydney: {
    name: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    population: '9.5 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  // Add more cities as needed
};

interface CityPageProps {
  params: { city: string; locale: string };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
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
  
  // Generate localized metadata
  if (locale === 'zh-hans') {
    return {
      title: `${localizedCityName}时间 | ${localizedCityName}当前时间`,
      description: `${localizedCityName}, ${localizedCountryName}的当前本地时间。查看${localizedCityName}的准确时间、时区和夏令时信息。`,
      keywords: [`${localizedCityName}时间`, `${localizedCountryName}时间`, `${localizedCityName}当前时间`, `${localizedCityName}本地时间`, `${localizedCityName}时区`],
      openGraph: {
        title: `${localizedCityName}时间 | 当前时间`,
        description: `查看${localizedCityName}, ${localizedCountryName}的当前本地时间`,
        type: 'website',
      },
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: `${localizedCityName}時間 | ${localizedCityName}當前時間`,
      description: `${localizedCityName}, ${localizedCountryName}的當前本地時間。查看${localizedCityName}的準確時間、時區和夏令時資訊。`,
      keywords: [`${localizedCityName}時間`, `${localizedCountryName}時間`, `${localizedCityName}當前時間`, `${localizedCityName}本地時間`, `${localizedCityName}時區`],
      openGraph: {
        title: `${localizedCityName}時間 | 當前時間`,
        description: `查看${localizedCityName}, ${localizedCountryName}的當前本地時間`,
        type: 'website',
      },
    };
  }
  
  // Default English metadata
  return {
    title: `${cityInfo.name} Time | Current Local Time in ${cityInfo.name}, ${cityInfo.country}`,
    description: `Current local time in ${cityInfo.name}, ${cityInfo.country}. Check the exact time, timezone, and daylight saving information for ${cityInfo.name}.`,
    keywords: [`${cityInfo.name} time`, `${cityInfo.country} time`, `current time in ${cityInfo.name}`, `local time ${cityInfo.name}`, `${cityInfo.name} timezone`],
    openGraph: {
      title: `${cityInfo.name} Time | Current Local Time`,
      description: `Check the current local time in ${cityInfo.name}, ${cityInfo.country}`,
      type: 'website',
    },
  };
}
