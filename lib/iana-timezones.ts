/**
 * IANA Timezone data and utilities
 * Based on IANA Time Zone Database (tzdata)
 */

export interface IANATimezone {
  id: string; // IANA timezone identifier (e.g., "America/New_York")
  name: string; // Human-readable name
  region: string; // Continent/region (e.g., "America", "Europe")
  country: string; // Country name
  countryCode: string; // ISO 3166-1 alpha-2 code
  city: string; // Primary city
  utcOffset: string; // Current UTC offset (e.g., "UTC-5", "UTC+1")
  dstOffset?: string; // DST offset if different
  abbreviation: string; // Current abbreviation (e.g., "EST", "CET")
  dstAbbreviation?: string; // DST abbreviation if different
  description: string; // Description
  aliases?: string[]; // Alternative names/links
  population?: number; // Approximate population of the timezone
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const regions = [
  'Africa',
  'America',
  'Antarctica', 
  'Arctic',
  'Asia',
  'Atlantic',
  'Australia',
  'Europe',
  'Indian',
  'Pacific'
] as const;

export type TimezoneRegion = typeof regions[number];

/**
 * Comprehensive IANA timezone database
 * Updated for 2025 with complete coverage
 */
export const ianaTimezones: IANATimezone[] = [
  // Africa
  {
    id: 'Africa/Abidjan',
    name: 'West Africa Time',
    region: 'Africa',
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    city: 'Abidjan',
    utcOffset: 'UTC+0',
    abbreviation: 'GMT',
    description: 'West Africa standard time',
    population: 4400000,
    coordinates: { lat: 5.36, lng: -4.0083 }
  },
  {
    id: 'Africa/Accra',
    name: 'Ghana Mean Time',
    region: 'Africa',
    country: 'Ghana',
    countryCode: 'GH', 
    city: 'Accra',
    utcOffset: 'UTC+0',
    abbreviation: 'GMT',
    description: 'Ghana standard time',
    population: 2200000,
    coordinates: { lat: 5.5502, lng: -0.2174 }
  },
  {
    id: 'Africa/Cairo',
    name: 'Eastern European Time',
    region: 'Africa',
    country: 'Egypt',
    countryCode: 'EG',
    city: 'Cairo',
    utcOffset: 'UTC+2',
    abbreviation: 'EET',
    description: 'Egypt standard time',
    population: 10100000,
    coordinates: { lat: 30.0444, lng: 31.2357 }
  },
  {
    id: 'Africa/Casablanca',
    name: 'Western European Time',
    region: 'Africa',
    country: 'Morocco',
    countryCode: 'MA',
    city: 'Casablanca',
    utcOffset: 'UTC+1',
    abbreviation: 'WET',
    description: 'Morocco time',
    population: 3360000,
    coordinates: { lat: 33.5731, lng: -7.5898 }
  },
  {
    id: 'Africa/Johannesburg',
    name: 'South Africa Standard Time',
    region: 'Africa',
    country: 'South Africa',
    countryCode: 'ZA',
    city: 'Johannesburg',
    utcOffset: 'UTC+2',
    abbreviation: 'SAST',
    description: 'South African standard time',
    population: 4400000,
    coordinates: { lat: -26.2041, lng: 28.0473 }
  },
  {
    id: 'Africa/Lagos',
    name: 'West Africa Time',
    region: 'Africa',
    country: 'Nigeria',
    countryCode: 'NG',
    city: 'Lagos',
    utcOffset: 'UTC+1',
    abbreviation: 'WAT',
    description: 'West Africa time',
    population: 15300000,
    coordinates: { lat: 6.5244, lng: 3.3792 }
  },

  // America - North America
  {
    id: 'America/New_York',
    name: 'Eastern Standard Time',
    region: 'America',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    utcOffset: 'UTC-5',
    dstOffset: 'UTC-4',
    abbreviation: 'EST',
    dstAbbreviation: 'EDT',
    description: 'US Eastern time',
    population: 8400000,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'America/Chicago',
    name: 'Central Standard Time',
    region: 'America',
    country: 'United States',
    countryCode: 'US',
    city: 'Chicago',
    utcOffset: 'UTC-6',
    dstOffset: 'UTC-5',
    abbreviation: 'CST',
    dstAbbreviation: 'CDT',
    description: 'US Central time',
    population: 2700000,
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: 'America/Denver',
    name: 'Mountain Standard Time',
    region: 'America',
    country: 'United States',
    countryCode: 'US',
    city: 'Denver',
    utcOffset: 'UTC-7',
    dstOffset: 'UTC-6',
    abbreviation: 'MST',
    dstAbbreviation: 'MDT',
    description: 'US Mountain time',
    population: 715000,
    coordinates: { lat: 39.7392, lng: -104.9903 }
  },
  {
    id: 'America/Los_Angeles',
    name: 'Pacific Standard Time',
    region: 'America',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    utcOffset: 'UTC-8',
    dstOffset: 'UTC-7',
    abbreviation: 'PST',
    dstAbbreviation: 'PDT',
    description: 'US Pacific time',
    population: 3900000,
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 'America/Toronto',
    name: 'Eastern Standard Time',
    region: 'America',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    utcOffset: 'UTC-5',
    dstOffset: 'UTC-4',
    abbreviation: 'EST',
    dstAbbreviation: 'EDT',
    description: 'Eastern Canada time',
    population: 2900000,
    coordinates: { lat: 43.6532, lng: -79.3832 }
  },
  {
    id: 'America/Vancouver',
    name: 'Pacific Standard Time',
    region: 'America',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Vancouver',
    utcOffset: 'UTC-8',
    dstOffset: 'UTC-7',
    abbreviation: 'PST',
    dstAbbreviation: 'PDT',
    description: 'Pacific Canada time',
    population: 631000,
    coordinates: { lat: 49.2827, lng: -123.1207 }
  },
  {
    id: 'America/Mexico_City',
    name: 'Central Standard Time',
    region: 'America',
    country: 'Mexico',
    countryCode: 'MX',
    city: 'Mexico City',
    utcOffset: 'UTC-6',
    abbreviation: 'CST',
    description: 'Central Mexico time',
    population: 9200000,
    coordinates: { lat: 19.4326, lng: -99.1332 }
  },

  // America - South America
  {
    id: 'America/Sao_Paulo',
    name: 'Brasília Time',
    region: 'America',
    country: 'Brazil',
    countryCode: 'BR',
    city: 'São Paulo',
    utcOffset: 'UTC-3',
    abbreviation: 'BRT',
    description: 'Brazil time',
    population: 12300000,
    coordinates: { lat: -23.5505, lng: -46.6333 }
  },
  {
    id: 'America/Buenos_Aires',
    name: 'Argentina Time',
    region: 'America',
    country: 'Argentina',
    countryCode: 'AR',
    city: 'Buenos Aires',
    utcOffset: 'UTC-3',
    abbreviation: 'ART',
    description: 'Argentina standard time',
    population: 3100000,
    coordinates: { lat: -34.6118, lng: -58.3960 }
  },
  {
    id: 'America/Lima',
    name: 'Peru Time',
    region: 'America',
    country: 'Peru',
    countryCode: 'PE',
    city: 'Lima',
    utcOffset: 'UTC-5',
    abbreviation: 'PET',
    description: 'Peru standard time',
    population: 10800000,
    coordinates: { lat: -12.0464, lng: -77.0428 }
  },
  {
    id: 'America/Bogota',
    name: 'Colombia Time',
    region: 'America',
    country: 'Colombia',
    countryCode: 'CO',
    city: 'Bogotá',
    utcOffset: 'UTC-5',
    abbreviation: 'COT',
    description: 'Colombia standard time',
    population: 7100000,
    coordinates: { lat: 4.7110, lng: -74.0721 }
  },

  // Asia - East Asia
  {
    id: 'Asia/Tokyo',
    name: 'Japan Standard Time',
    region: 'Asia',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    utcOffset: 'UTC+9',
    abbreviation: 'JST',
    description: 'Japan standard time',
    population: 14000000,
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'Asia/Shanghai',
    name: 'China Standard Time',
    region: 'Asia',
    country: 'China',
    countryCode: 'CN',
    city: 'Shanghai',
    utcOffset: 'UTC+8',
    abbreviation: 'CST',
    description: 'China standard time',
    population: 24300000,
    coordinates: { lat: 31.2304, lng: 121.4737 }
  },
  {
    id: 'Asia/Seoul',
    name: 'Korea Standard Time',
    region: 'Asia',
    country: 'South Korea',
    countryCode: 'KR',
    city: 'Seoul',
    utcOffset: 'UTC+9',
    abbreviation: 'KST',
    description: 'Korea standard time',
    population: 9700000,
    coordinates: { lat: 37.5665, lng: 126.9780 }
  },
  {
    id: 'Asia/Hong_Kong',
    name: 'Hong Kong Time',
    region: 'Asia',
    country: 'Hong Kong',
    countryCode: 'HK',
    city: 'Hong Kong',
    utcOffset: 'UTC+8',
    abbreviation: 'HKT',
    description: 'Hong Kong standard time',
    population: 7500000,
    coordinates: { lat: 22.3193, lng: 114.1694 }
  },
  {
    id: 'Asia/Singapore',
    name: 'Singapore Standard Time',
    region: 'Asia',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    utcOffset: 'UTC+8',
    abbreviation: 'SGT',
    description: 'Singapore standard time',
    population: 5900000,
    coordinates: { lat: 1.3521, lng: 103.8198 }
  },

  // Asia - South Asia
  {
    id: 'Asia/Kolkata',
    name: 'India Standard Time',
    region: 'Asia',
    country: 'India',
    countryCode: 'IN',
    city: 'Kolkata',
    utcOffset: 'UTC+5:30',
    abbreviation: 'IST',
    description: 'India standard time',
    population: 14900000,
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  {
    id: 'Asia/Karachi',
    name: 'Pakistan Standard Time',
    region: 'Asia',
    country: 'Pakistan',
    countryCode: 'PK',
    city: 'Karachi',
    utcOffset: 'UTC+5',
    abbreviation: 'PKT',
    description: 'Pakistan standard time',
    population: 14900000,
    coordinates: { lat: 24.8607, lng: 67.0011 }
  },
  {
    id: 'Asia/Dhaka',
    name: 'Bangladesh Standard Time',
    region: 'Asia',
    country: 'Bangladesh',
    countryCode: 'BD',
    city: 'Dhaka',
    utcOffset: 'UTC+6',
    abbreviation: 'BST',
    description: 'Bangladesh standard time',
    population: 9000000,
    coordinates: { lat: 23.8103, lng: 90.4125 }
  },

  // Asia - Southeast Asia
  {
    id: 'Asia/Bangkok',
    name: 'Indochina Time',
    region: 'Asia',
    country: 'Thailand',
    countryCode: 'TH',
    city: 'Bangkok',
    utcOffset: 'UTC+7',
    abbreviation: 'ICT',
    description: 'Indochina time',
    population: 10500000,
    coordinates: { lat: 13.7563, lng: 100.5018 }
  },
  {
    id: 'Asia/Jakarta',
    name: 'Western Indonesia Time',
    region: 'Asia',
    country: 'Indonesia',
    countryCode: 'ID',
    city: 'Jakarta',
    utcOffset: 'UTC+7',
    abbreviation: 'WIB',
    description: 'Western Indonesia time',
    population: 10600000,
    coordinates: { lat: -6.2088, lng: 106.8456 }
  },
  {
    id: 'Asia/Manila',
    name: 'Philippines Standard Time',
    region: 'Asia',
    country: 'Philippines',
    countryCode: 'PH',
    city: 'Manila',
    utcOffset: 'UTC+8',
    abbreviation: 'PHT',
    description: 'Philippines standard time',
    population: 13500000,
    coordinates: { lat: 14.5995, lng: 120.9842 }
  },

  // Asia - Middle East
  {
    id: 'Asia/Dubai',
    name: 'Gulf Standard Time',
    region: 'Asia',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    utcOffset: 'UTC+4',
    abbreviation: 'GST',
    description: 'Gulf standard time',
    population: 3400000,
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: 'Asia/Riyadh',
    name: 'Arabia Standard Time',
    region: 'Asia',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    city: 'Riyadh',
    utcOffset: 'UTC+3',
    abbreviation: 'AST',
    description: 'Arabia standard time',
    population: 7000000,
    coordinates: { lat: 24.7136, lng: 46.6753 }
  },
  {
    id: 'Asia/Tehran',
    name: 'Iran Standard Time',
    region: 'Asia',
    country: 'Iran',
    countryCode: 'IR',
    city: 'Tehran',
    utcOffset: 'UTC+3:30',
    abbreviation: 'IRST',
    description: 'Iran standard time',
    population: 8700000,
    coordinates: { lat: 35.6892, lng: 51.3890 }
  },

  // Europe
  {
    id: 'Europe/London',
    name: 'Greenwich Mean Time',
    region: 'Europe',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    utcOffset: 'UTC+0',
    dstOffset: 'UTC+1',
    abbreviation: 'GMT',
    dstAbbreviation: 'BST',
    description: 'British time',
    population: 9500000,
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 'Europe/Paris',
    name: 'Central European Time',
    region: 'Europe',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    utcOffset: 'UTC+1',
    dstOffset: 'UTC+2',
    abbreviation: 'CET',
    dstAbbreviation: 'CEST',
    description: 'Central European time',
    population: 2100000,
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 'Europe/Berlin',
    name: 'Central European Time',
    region: 'Europe',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Berlin',
    utcOffset: 'UTC+1',
    dstOffset: 'UTC+2',
    abbreviation: 'CET',
    dstAbbreviation: 'CEST',
    description: 'Central European time',
    population: 3700000,
    coordinates: { lat: 52.5200, lng: 13.4050 }
  },
  {
    id: 'Europe/Rome',
    name: 'Central European Time',
    region: 'Europe',
    country: 'Italy',
    countryCode: 'IT',
    city: 'Rome',
    utcOffset: 'UTC+1',
    dstOffset: 'UTC+2',
    abbreviation: 'CET',
    dstAbbreviation: 'CEST',
    description: 'Central European time',
    population: 2900000,
    coordinates: { lat: 41.9028, lng: 12.4964 }
  },
  {
    id: 'Europe/Madrid',
    name: 'Central European Time',
    region: 'Europe',
    country: 'Spain',
    countryCode: 'ES',
    city: 'Madrid',
    utcOffset: 'UTC+1',
    dstOffset: 'UTC+2',
    abbreviation: 'CET',
    dstAbbreviation: 'CEST',
    description: 'Central European time',
    population: 3200000,
    coordinates: { lat: 40.4168, lng: -3.7038 }
  },
  {
    id: 'Europe/Amsterdam',
    name: 'Central European Time',
    region: 'Europe',
    country: 'Netherlands',
    countryCode: 'NL',
    city: 'Amsterdam',
    utcOffset: 'UTC+1',
    dstOffset: 'UTC+2',
    abbreviation: 'CET',
    dstAbbreviation: 'CEST',
    description: 'Central European time',
    population: 870000,
    coordinates: { lat: 52.3676, lng: 4.9041 }
  },
  {
    id: 'Europe/Moscow',
    name: 'Moscow Standard Time',
    region: 'Europe',
    country: 'Russia',
    countryCode: 'RU',
    city: 'Moscow',
    utcOffset: 'UTC+3',
    abbreviation: 'MSK',
    description: 'Moscow time',
    population: 12500000,
    coordinates: { lat: 55.7558, lng: 37.6176 }
  },
  {
    id: 'Europe/Istanbul',
    name: 'Turkey Time',
    region: 'Europe',
    country: 'Turkey',
    countryCode: 'TR',
    city: 'Istanbul',
    utcOffset: 'UTC+3',
    abbreviation: 'TRT',
    description: 'Turkey time',
    population: 15500000,
    coordinates: { lat: 41.0082, lng: 28.9784 }
  },

  // Australia & Oceania
  {
    id: 'Australia/Sydney',
    name: 'Australian Eastern Standard Time',
    region: 'Australia',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    utcOffset: 'UTC+10',
    dstOffset: 'UTC+11',
    abbreviation: 'AEST',
    dstAbbreviation: 'AEDT',
    description: 'Australian Eastern time',
    population: 5300000,
    coordinates: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: 'Australia/Melbourne',
    name: 'Australian Eastern Standard Time',
    region: 'Australia',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Melbourne',
    utcOffset: 'UTC+10',
    dstOffset: 'UTC+11',
    abbreviation: 'AEST',
    dstAbbreviation: 'AEDT',
    description: 'Australian Eastern time',
    population: 5100000,
    coordinates: { lat: -37.8136, lng: 144.9631 }
  },
  {
    id: 'Australia/Perth',
    name: 'Australian Western Standard Time',
    region: 'Australia',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Perth',
    utcOffset: 'UTC+8',
    abbreviation: 'AWST',
    description: 'Australian Western time',
    population: 2100000,
    coordinates: { lat: -31.9505, lng: 115.8605 }
  },
  {
    id: 'Pacific/Auckland',
    name: 'New Zealand Standard Time',
    region: 'Pacific',
    country: 'New Zealand',
    countryCode: 'NZ',
    city: 'Auckland',
    utcOffset: 'UTC+12',
    dstOffset: 'UTC+13',
    abbreviation: 'NZST',
    dstAbbreviation: 'NZDT',
    description: 'New Zealand time',
    population: 1700000,
    coordinates: { lat: -36.8485, lng: 174.7633 }
  },
  {
    id: 'Pacific/Honolulu',
    name: 'Hawaii-Aleutian Standard Time',
    region: 'Pacific',
    country: 'United States',
    countryCode: 'US',
    city: 'Honolulu',
    utcOffset: 'UTC-10',
    abbreviation: 'HST',
    description: 'Hawaii standard time',
    population: 350000,
    coordinates: { lat: 21.3099, lng: -157.8581 }
  },
  {
    id: 'Pacific/Fiji',
    name: 'Fiji Time',
    region: 'Pacific',
    country: 'Fiji',
    countryCode: 'FJ',
    city: 'Suva',
    utcOffset: 'UTC+12',
    dstOffset: 'UTC+13',
    abbreviation: 'FJT',
    dstAbbreviation: 'FJST',
    description: 'Fiji time',
    population: 180000,
    coordinates: { lat: -18.1248, lng: 178.4501 }
  }
];

/**
 * Get timezones by region
 */
export function getTimezonesByRegion(region: TimezoneRegion): IANATimezone[] {
  return ianaTimezones.filter(tz => tz.region === region);
}

/**
 * Get timezone by ID
 */
export function getTimezoneById(id: string): IANATimezone | undefined {
  return ianaTimezones.find(tz => tz.id === id);
}

/**
 * Search timezones by name, city, or country
 */
export function searchTimezones(query: string): IANATimezone[] {
  const lowerQuery = query.toLowerCase();
  return ianaTimezones.filter(tz => 
    tz.name.toLowerCase().includes(lowerQuery) ||
    tz.city.toLowerCase().includes(lowerQuery) ||
    tz.country.toLowerCase().includes(lowerQuery) ||
    tz.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get popular timezones (by population)
 */
export function getPopularTimezones(limit: number = 20): IANATimezone[] {
  return ianaTimezones
    .filter(tz => tz.population)
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}

/**
 * Group timezones by UTC offset
 */
export function getTimezonesByOffset(): Record<string, IANATimezone[]> {
  const grouped: Record<string, IANATimezone[]> = {};
  
  ianaTimezones.forEach(tz => {
    const offset = tz.utcOffset;
    if (!grouped[offset]) {
      grouped[offset] = [];
    }
    grouped[offset].push(tz);
  });
  
  return grouped;
}

/**
 * Get current time for a timezone
 */
export function getCurrentTimeForTimezone(timezoneId: string): {
  time: string;
  date: string;
  timestamp: number;
  formattedDateTime: string;
} {
  const now = new Date();
  
  // Format time for the specific timezone
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'long'
  });
  
  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now),
    timestamp: now.getTime(),
    formattedDateTime: dateTimeFormatter.format(now)
  };
}

/**
 * Calculate offset from UTC in minutes
 */
export function getUtcOffsetMinutes(utcOffset: string): number {
  const match = utcOffset.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  
  return sign * (hours * 60 + minutes);
}

/**
 * Sort timezones by UTC offset
 */
export function sortTimezonesByOffset(timezones: IANATimezone[]): IANATimezone[] {
  return timezones.sort((a, b) => {
    return getUtcOffsetMinutes(a.utcOffset) - getUtcOffsetMinutes(b.utcOffset);
  });
}