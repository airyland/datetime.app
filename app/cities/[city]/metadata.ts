import { Metadata } from 'next';

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
  params: { city: string };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = params.city;
  const cityInfo = citiesData[city as keyof typeof citiesData];
  
  if (!cityInfo) return {};
  
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
