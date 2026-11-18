/**
 * Holidays utility functions
 * This file provides functions to work with holiday data from date-holidays library
 */

// Types for holiday data
export interface Holiday {
  date: string;
  start: Date;
  end: Date;
  name: string;
  type: 'public' | 'bank' | 'school' | 'optional' | 'observance';
  substitute?: boolean;
  note?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
}

export interface RegionInfo {
  code: string;
  name: string;
}

export interface LanguageInfo {
  code: string;
  name: string;
}

// List of supported languages
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
];

// List of common countries for the holidays module

// List of countries with their names
export const COUNTRIES: CountryInfo[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SG', name: 'Singapore' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'IE', name: 'Ireland' },
];

// Map of regions for countries that have them
export const REGIONS: Record<string, RegionInfo[]> = {
  'US': [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    // Add more US states as needed
  ],
  'CA': [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    // Add more Canadian provinces as needed
  ],
  // Add more countries with regions as needed
};

/**
 * Get all supported countries
 * @returns Array of country information objects
 */
export function getCountries(): CountryInfo[] {
  return COUNTRIES;
}

/**
 * Get regions for a specific country
 * @param countryCode ISO country code
 * @returns Array of region information objects or empty array if no regions
 */
export function getRegions(countryCode: string): RegionInfo[] {
  return REGIONS[countryCode] || [];
}

/**
 * Fallback function to get sample holidays when the date-holidays library fails
 * @param countryCode ISO country code
 * @param year Year to get holidays for
 * @returns Array of sample holiday objects
 */
export function getSampleHolidays(countryCode: string, year: number = new Date().getFullYear()): Holiday[] {
  // This is a fallback with sample data for when the date-holidays library fails
  const sampleHolidays: Record<string, Holiday[]> = {
    'US': [
      {
        date: `${year}-01-01 00:00:00`,
        start: new Date(`${year}-01-01T00:00:00`),
        end: new Date(`${year}-01-02T00:00:00`),
        name: "New Year's Day",
        type: 'public'
      },
      {
        date: `${year}-07-04 00:00:00`,
        start: new Date(`${year}-07-04T00:00:00`),
        end: new Date(`${year}-07-05T00:00:00`),
        name: "Independence Day",
        type: 'public'
      },
      {
        date: `${year}-12-25 00:00:00`,
        start: new Date(`${year}-12-25T00:00:00`),
        end: new Date(`${year}-12-26T00:00:00`),
        name: "Christmas Day",
        type: 'public'
      }
    ],
    // Add more sample data for other countries
  };

  return sampleHolidays[countryCode] || [];
}
