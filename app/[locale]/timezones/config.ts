export interface TimezoneConfig {
  slug: string;
  name: string;
  abbreviation: string;
  ianaTz: string;
  utcOffset: string;
  description: string;
}

export const timezones: TimezoneConfig[] = [
  {
    slug: 'gmt',
    name: 'Greenwich Mean Time',
    abbreviation: 'GMT',
    ianaTz: 'Etc/GMT',
    utcOffset: 'UTC+0',
    description: 'Greenwich meridian time'
  },
  {
    slug: 'cet',
    name: 'Central European Time',
    abbreviation: 'CET',
    ianaTz: 'Europe/Berlin',
    utcOffset: 'UTC+1',
    description: 'Central European standard time'
  },
  {
    slug: 'pst',
    name: 'Pacific Standard Time',
    abbreviation: 'PST',
    ianaTz: 'America/Los_Angeles',
    utcOffset: 'UTC-8',
    description: 'US Pacific coast time'
  },
  {
    slug: 'mst',
    name: 'Mountain Standard Time',
    abbreviation: 'MST',
    ianaTz: 'America/Denver',
    utcOffset: 'UTC-7',
    description: 'US Mountain time'
  },
  {
    slug: 'cst',
    name: 'Central Standard Time',
    abbreviation: 'CST',
    ianaTz: 'America/Chicago',
    utcOffset: 'UTC-6',
    description: 'US Central time'
  },
  {
    slug: 'est',
    name: 'Eastern Standard Time',
    abbreviation: 'EST',
    ianaTz: 'America/New_York',
    utcOffset: 'UTC-5',
    description: 'US Eastern time'
  },
  {
    slug: 'eet',
    name: 'Eastern European Time',
    abbreviation: 'EET',
    ianaTz: 'Europe/Athens',
    utcOffset: 'UTC+2',
    description: 'Eastern European time'
  },
  {
    slug: 'ist',
    name: 'India Standard Time',
    abbreviation: 'IST',
    ianaTz: 'Asia/Kolkata',
    utcOffset: 'UTC+5:30',
    description: 'Indian standard time'
  },
  {
    slug: 'china-cst',
    name: 'China Standard Time',
    abbreviation: 'CST',
    ianaTz: 'Asia/Shanghai',
    utcOffset: 'UTC+8',
    description: 'China standard time'
  },
  {
    slug: 'jst',
    name: 'Japan Standard Time',
    abbreviation: 'JST',
    ianaTz: 'Asia/Tokyo',
    utcOffset: 'UTC+9',
    description: 'Japan standard time'
  },
  {
    slug: 'aest',
    name: 'Australian Eastern Standard Time',
    abbreviation: 'AEST',
    ianaTz: 'Australia/Sydney',
    utcOffset: 'UTC+10',
    description: 'Australian Eastern time'
  },
  {
    slug: 'sast',
    name: 'South Africa Standard Time',
    abbreviation: 'SAST',
    ianaTz: 'Africa/Johannesburg',
    utcOffset: 'UTC+2',
    description: 'South African time'
  },
  {
    slug: 'msk',
    name: 'Moscow Standard Time',
    abbreviation: 'MSK',
    ianaTz: 'Europe/Moscow',
    utcOffset: 'UTC+3',
    description: 'Moscow time'
  },
  {
    slug: 'nzst',
    name: 'New Zealand Standard Time',
    abbreviation: 'NZST',
    ianaTz: 'Pacific/Auckland',
    utcOffset: 'UTC+12',
    description: 'New Zealand time'
  }
];