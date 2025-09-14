import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// Predefined list of supported cities with their metadata
export const citiesData = {
  // North America
  'new-york': {
    name: 'New York',
    country: 'United States',
    timezone: 'America/New_York',
    population: '8.3 million',
    coordinates: '40.7128° N, 74.0060° W',
  },
  'los-angeles': {
    name: 'Los Angeles',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    population: '4 million',
    coordinates: '34.0522° N, 118.2437° W',
  },
  'chicago': {
    name: 'Chicago',
    country: 'United States',
    timezone: 'America/Chicago',
    population: '2.7 million',
    coordinates: '41.8781° N, 87.6298° W',
  },
  'toronto': {
    name: 'Toronto',
    country: 'Canada',
    timezone: 'America/Toronto',
    population: '2.9 million',
    coordinates: '43.6532° N, 79.3832° W',
  },
  'vancouver': {
    name: 'Vancouver',
    country: 'Canada',
    timezone: 'America/Vancouver',
    population: '675,000',
    coordinates: '49.2827° N, 123.1207° W',
  },
  'mexico-city': {
    name: 'Mexico City',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    population: '9.2 million',
    coordinates: '19.4326° N, 99.1332° W',
  },
  'houston': {
    name: 'Houston',
    country: 'United States',
    timezone: 'America/Chicago',
    population: '2.3 million',
    coordinates: '29.7604° N, 95.3698° W',
  },
  'miami': {
    name: 'Miami',
    country: 'United States',
    timezone: 'America/New_York',
    population: '467,000',
    coordinates: '25.7617° N, 80.1918° W',
  },
  'atlanta': {
    name: 'Atlanta',
    country: 'United States',
    timezone: 'America/New_York',
    population: '498,000',
    coordinates: '33.7490° N, 84.3880° W',
  },
  'boston': {
    name: 'Boston',
    country: 'United States',
    timezone: 'America/New_York',
    population: '695,000',
    coordinates: '42.3601° N, 71.0589° W',
  },
  'seattle': {
    name: 'Seattle',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    population: '737,000',
    coordinates: '47.6062° N, 122.3321° W',
  },
  'san-francisco': {
    name: 'San Francisco',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    population: '873,000',
    coordinates: '37.7749° N, 122.4194° W',
  },

  // Europe
  'london': {
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    population: '9 million',
    coordinates: '51.5074° N, 0.1278° W',
  },
  'paris': {
    name: 'Paris',
    country: 'France',
    timezone: 'Europe/Paris',
    population: '2.2 million',
    coordinates: '48.8566° N, 2.3522° E',
  },
  'berlin': {
    name: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    population: '3.7 million',
    coordinates: '52.5200° N, 13.4050° E',
  },
  'rome': {
    name: 'Rome',
    country: 'Italy',
    timezone: 'Europe/Rome',
    population: '2.9 million',
    coordinates: '41.9028° N, 12.4964° E',
  },
  'madrid': {
    name: 'Madrid',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    population: '3.3 million',
    coordinates: '40.4168° N, 3.7038° W',
  },
  'amsterdam': {
    name: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    population: '872,000',
    coordinates: '52.3676° N, 4.9041° E',
  },
  'moscow': {
    name: 'Moscow',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    population: '12.5 million',
    coordinates: '55.7558° N, 37.6173° E',
  },
  'vienna': {
    name: 'Vienna',
    country: 'Austria',
    timezone: 'Europe/Vienna',
    population: '1.9 million',
    coordinates: '48.2082° N, 16.3738° E',
  },
  'prague': {
    name: 'Prague',
    country: 'Czech Republic',
    timezone: 'Europe/Prague',
    population: '1.3 million',
    coordinates: '50.0755° N, 14.4378° E',
  },
  'brussels': {
    name: 'Brussels',
    country: 'Belgium',
    timezone: 'Europe/Brussels',
    population: '1.2 million',
    coordinates: '50.8503° N, 4.3517° E',
  },
  'zurich': {
    name: 'Zurich',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    population: '434,000',
    coordinates: '47.3769° N, 8.5417° E',
  },
  'stockholm': {
    name: 'Stockholm',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    population: '975,000',
    coordinates: '59.3293° N, 18.0686° E',
  },

  // Asia
  'tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    population: '14 million',
    coordinates: '35.6762° N, 139.6503° E',
  },
  'beijing': {
    name: 'Beijing',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '21.5 million',
    coordinates: '39.9042° N, 116.4074° E',
  },
  'shanghai': {
    name: 'Shanghai',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '24.3 million',
    coordinates: '31.2304° N, 121.4737° E',
  },
  'hong-kong': {
    name: 'Hong Kong',
    country: 'Hong Kong',
    timezone: 'Asia/Hong_Kong',
    population: '7.5 million',
    coordinates: '22.3193° N, 114.1694° E',
  },
  'singapore': {
    name: 'Singapore',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    population: '5.7 million',
    coordinates: '1.3521° N, 103.8198° E',
  },
  'seoul': {
    name: 'Seoul',
    country: 'South Korea',
    timezone: 'Asia/Seoul',
    population: '9.7 million',
    coordinates: '37.5665° N, 126.9780° E',
  },
  'bangkok': {
    name: 'Bangkok',
    country: 'Thailand',
    timezone: 'Asia/Bangkok',
    population: '10.5 million',
    coordinates: '13.7563° N, 100.5018° E',
  },
  'mumbai': {
    name: 'Mumbai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '20.4 million',
    coordinates: '19.0760° N, 72.8777° E',
  },
  'delhi': {
    name: 'Delhi',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '32.9 million',
    coordinates: '28.7041° N, 77.1025° E',
  },
  'dubai': {
    name: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    population: '3.5 million',
    coordinates: '25.2048° N, 55.2708° E',
  },
  'taipei': {
    name: 'Taipei',
    country: 'Taiwan',
    timezone: 'Asia/Taipei',
    population: '2.6 million',
    coordinates: '25.0330° N, 121.5654° E',
  },
  'kuala-lumpur': {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    timezone: 'Asia/Kuala_Lumpur',
    population: '1.8 million',
    coordinates: '3.1390° N, 101.6869° E',
  },
  'kolkata': {
    name: 'Kolkata',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '14.8 million',
    coordinates: '22.5726° N, 88.3639° E',
  },

  // Oceania
  'sydney': {
    name: 'Sydney',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    population: '5.3 million',
    coordinates: '33.8688° S, 151.2093° E',
  },
  'melbourne': {
    name: 'Melbourne',
    country: 'Australia',
    timezone: 'Australia/Melbourne',
    population: '5.1 million',
    coordinates: '37.8136° S, 144.9631° E',
  },
  'auckland': {
    name: 'Auckland',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    population: '1.7 million',
    coordinates: '36.8485° S, 174.7633° E',
  },
  'brisbane': {
    name: 'Brisbane',
    country: 'Australia',
    timezone: 'Australia/Brisbane',
    population: '2.6 million',
    coordinates: '27.4698° S, 153.0251° E',
  },
  'perth': {
    name: 'Perth',
    country: 'Australia',
    timezone: 'Australia/Perth',
    population: '2.1 million',
    coordinates: '31.9505° S, 115.8605° E',
  },
  'wellington': {
    name: 'Wellington',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    population: '215,000',
    coordinates: '41.2865° S, 174.7762° E',
  },

  // South America
  'sao-paulo': {
    name: 'São Paulo',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    population: '12.3 million',
    coordinates: '23.5505° S, 46.6333° W',
  },
  'rio-de-janeiro': {
    name: 'Rio de Janeiro',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    population: '6.7 million',
    coordinates: '22.9068° S, 43.1729° W',
  },
  'buenos-aires': {
    name: 'Buenos Aires',
    country: 'Argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    population: '3.1 million',
    coordinates: '34.6037° S, 58.3816° W',
  },
  'lima': {
    name: 'Lima',
    country: 'Peru',
    timezone: 'America/Lima',
    population: '10.7 million',
    coordinates: '12.0464° S, 77.0428° W',
  },
  'bogota': {
    name: 'Bogotá',
    country: 'Colombia',
    timezone: 'America/Bogota',
    population: '7.4 million',
    coordinates: '4.7110° N, 74.0721° W',
  },
  'santiago': {
    name: 'Santiago',
    country: 'Chile',
    timezone: 'America/Santiago',
    population: '5.6 million',
    coordinates: '33.4489° S, 70.6693° W',
  },

  // Africa
  'cairo': {
    name: 'Cairo',
    country: 'Egypt',
    timezone: 'Africa/Cairo',
    population: '10.1 million',
    coordinates: '30.0444° N, 31.2357° E',
  },
  'johannesburg': {
    name: 'Johannesburg',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    population: '5.6 million',
    coordinates: '26.2041° S, 28.0473° E',
  },
  'cape-town': {
    name: 'Cape Town',
    country: 'South Africa',
    timezone: 'Africa/Johannesburg',
    population: '4.6 million',
    coordinates: '33.9249° S, 18.4241° E',
  },
  'lagos': {
    name: 'Lagos',
    country: 'Nigeria',
    timezone: 'Africa/Lagos',
    population: '14.8 million',
    coordinates: '6.5244° N, 3.3792° E',
  },
  'nairobi': {
    name: 'Nairobi',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    population: '4.4 million',
    coordinates: '1.2921° S, 36.8219° E',
  },
  'casablanca': {
    name: 'Casablanca',
    country: 'Morocco',
    timezone: 'Africa/Casablanca',
    population: '3.4 million',
    coordinates: '33.5731° N, 7.5898° W',
  },

  // Middle East
  'istanbul': {
    name: 'Istanbul',
    country: 'Turkey',
    timezone: 'Europe/Istanbul',
    population: '15.5 million',
    coordinates: '41.0082° N, 28.9784° E',
  },
  'tel-aviv': {
    name: 'Tel Aviv',
    country: 'Israel',
    timezone: 'Asia/Jerusalem',
    population: '460,000',
    coordinates: '32.0853° N, 34.7818° E',
  },
  'jerusalem': {
    name: 'Jerusalem',
    country: 'Israel',
    timezone: 'Asia/Jerusalem',
    population: '936,000',
    coordinates: '31.7683° N, 35.2137° E',
  },
  'riyadh': {
    name: 'Riyadh',
    country: 'Saudi Arabia',
    timezone: 'Asia/Riyadh',
    population: '7.7 million',
    coordinates: '24.7136° N, 46.6753° E',
  },
  'doha': {
    name: 'Doha',
    country: 'Qatar',
    timezone: 'Asia/Qatar',
    population: '956,000',
    coordinates: '25.2854° N, 51.5310° E',
  },
  'kuwait-city': {
    name: 'Kuwait City',
    country: 'Kuwait',
    timezone: 'Asia/Kuwait',
    population: '4.1 million',
    coordinates: '29.3759° N, 47.9774° E',
  },
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