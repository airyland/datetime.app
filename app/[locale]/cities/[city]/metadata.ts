import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"

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

  // North America (more)
  'washington-dc': {
    name: 'Washington, D.C.',
    country: 'United States',
    timezone: 'America/New_York',
    population: '690,000',
    coordinates: '38.9072° N, 77.0369° W',
  },
  'philadelphia': {
    name: 'Philadelphia',
    country: 'United States',
    timezone: 'America/New_York',
    population: '1.6 million',
    coordinates: '39.9526° N, 75.1652° W',
  },
  'dallas': {
    name: 'Dallas',
    country: 'United States',
    timezone: 'America/Chicago',
    population: '1.3 million',
    coordinates: '32.7767° N, 96.7970° W',
  },
  'denver': {
    name: 'Denver',
    country: 'United States',
    timezone: 'America/Denver',
    population: '715,000',
    coordinates: '39.7392° N, 104.9903° W',
  },
  'phoenix': {
    name: 'Phoenix',
    country: 'United States',
    timezone: 'America/Phoenix',
    population: '1.6 million',
    coordinates: '33.4484° N, 112.0740° W',
  },
  'las-vegas': {
    name: 'Las Vegas',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    population: '650,000',
    coordinates: '36.1699° N, 115.1398° W',
  },
  'san-diego': {
    name: 'San Diego',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    population: '1.4 million',
    coordinates: '32.7157° N, 117.1611° W',
  },
  'honolulu': {
    name: 'Honolulu',
    country: 'United States',
    timezone: 'Pacific/Honolulu',
    population: '350,000',
    coordinates: '21.3069° N, 157.8583° W',
  },
  'anchorage': {
    name: 'Anchorage',
    country: 'United States',
    timezone: 'America/Anchorage',
    population: '290,000',
    coordinates: '61.2181° N, 149.9003° W',
  },
  'montreal': {
    name: 'Montreal',
    country: 'Canada',
    timezone: 'America/Toronto',
    population: '1.8 million',
    coordinates: '45.5017° N, 73.5673° W',
  },
  'calgary': {
    name: 'Calgary',
    country: 'Canada',
    timezone: 'America/Edmonton',
    population: '1.3 million',
    coordinates: '51.0447° N, 114.0719° W',
  },
  'ottawa': {
    name: 'Ottawa',
    country: 'Canada',
    timezone: 'America/Toronto',
    population: '1 million',
    coordinates: '45.4215° N, 75.6972° W',
  },
  'edmonton': {
    name: 'Edmonton',
    country: 'Canada',
    timezone: 'America/Edmonton',
    population: '1 million',
    coordinates: '53.5461° N, 113.4938° W',
  },
  'guadalajara': {
    name: 'Guadalajara',
    country: 'Mexico',
    timezone: 'America/Mexico_City',
    population: '1.4 million',
    coordinates: '20.6597° N, 103.3496° W',
  },
  'monterrey': {
    name: 'Monterrey',
    country: 'Mexico',
    timezone: 'America/Monterrey',
    population: '1.1 million',
    coordinates: '25.6866° N, 100.3161° W',
  },
  'havana': {
    name: 'Havana',
    country: 'Cuba',
    timezone: 'America/Havana',
    population: '2.1 million',
    coordinates: '23.1136° N, 82.3666° W',
  },
  'panama-city': {
    name: 'Panama City',
    country: 'Panama',
    timezone: 'America/Panama',
    population: '880,000',
    coordinates: '8.9824° N, 79.5199° W',
  },
  'kingston': {
    name: 'Kingston',
    country: 'Jamaica',
    timezone: 'America/Jamaica',
    population: '670,000',
    coordinates: '17.9712° N, 76.7936° W',
  },
  'guatemala-city': {
    name: 'Guatemala City',
    country: 'Guatemala',
    timezone: 'America/Guatemala',
    population: '1 million',
    coordinates: '14.6349° N, 90.5069° W',
  },

  // Europe (more)
  'dublin': {
    name: 'Dublin',
    country: 'Ireland',
    timezone: 'Europe/Dublin',
    population: '590,000',
    coordinates: '53.3498° N, 6.2603° W',
  },
  'lisbon': {
    name: 'Lisbon',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    population: '550,000',
    coordinates: '38.7223° N, 9.1393° W',
  },
  'athens': {
    name: 'Athens',
    country: 'Greece',
    timezone: 'Europe/Athens',
    population: '640,000',
    coordinates: '37.9838° N, 23.7275° E',
  },
  'warsaw': {
    name: 'Warsaw',
    country: 'Poland',
    timezone: 'Europe/Warsaw',
    population: '1.8 million',
    coordinates: '52.2297° N, 21.0122° E',
  },
  'budapest': {
    name: 'Budapest',
    country: 'Hungary',
    timezone: 'Europe/Budapest',
    population: '1.7 million',
    coordinates: '47.4979° N, 19.0402° E',
  },
  'copenhagen': {
    name: 'Copenhagen',
    country: 'Denmark',
    timezone: 'Europe/Copenhagen',
    population: '660,000',
    coordinates: '55.6761° N, 12.5683° E',
  },
  'oslo': {
    name: 'Oslo',
    country: 'Norway',
    timezone: 'Europe/Oslo',
    population: '710,000',
    coordinates: '59.9139° N, 10.7522° E',
  },
  'helsinki': {
    name: 'Helsinki',
    country: 'Finland',
    timezone: 'Europe/Helsinki',
    population: '680,000',
    coordinates: '60.1699° N, 24.9384° E',
  },
  'kyiv': {
    name: 'Kyiv',
    country: 'Ukraine',
    timezone: 'Europe/Kyiv',
    population: '2.9 million',
    coordinates: '50.4501° N, 30.5234° E',
  },
  'bucharest': {
    name: 'Bucharest',
    country: 'Romania',
    timezone: 'Europe/Bucharest',
    population: '1.7 million',
    coordinates: '44.4268° N, 26.1025° E',
  },
  'sofia': {
    name: 'Sofia',
    country: 'Bulgaria',
    timezone: 'Europe/Sofia',
    population: '1.3 million',
    coordinates: '42.6977° N, 23.3219° E',
  },
  'belgrade': {
    name: 'Belgrade',
    country: 'Serbia',
    timezone: 'Europe/Belgrade',
    population: '1.2 million',
    coordinates: '44.7866° N, 20.4489° E',
  },
  'zagreb': {
    name: 'Zagreb',
    country: 'Croatia',
    timezone: 'Europe/Zagreb',
    population: '770,000',
    coordinates: '45.8150° N, 15.9819° E',
  },
  'reykjavik': {
    name: 'Reykjavik',
    country: 'Iceland',
    timezone: 'Atlantic/Reykjavik',
    population: '140,000',
    coordinates: '64.1466° N, 21.9426° W',
  },
  'edinburgh': {
    name: 'Edinburgh',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    population: '510,000',
    coordinates: '55.9533° N, 3.1883° W',
  },
  'manchester': {
    name: 'Manchester',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    population: '570,000',
    coordinates: '53.4808° N, 2.2426° W',
  },
  'barcelona': {
    name: 'Barcelona',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    population: '1.6 million',
    coordinates: '41.3874° N, 2.1686° E',
  },
  'milan': {
    name: 'Milan',
    country: 'Italy',
    timezone: 'Europe/Rome',
    population: '1.4 million',
    coordinates: '45.4642° N, 9.1900° E',
  },
  'munich': {
    name: 'Munich',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    population: '1.5 million',
    coordinates: '48.1351° N, 11.5820° E',
  },
  'frankfurt': {
    name: 'Frankfurt',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    population: '760,000',
    coordinates: '50.1109° N, 8.6821° E',
  },
  'saint-petersburg': {
    name: 'Saint Petersburg',
    country: 'Russia',
    timezone: 'Europe/Moscow',
    population: '5.6 million',
    coordinates: '59.9311° N, 30.3609° E',
  },
  'vilnius': {
    name: 'Vilnius',
    country: 'Lithuania',
    timezone: 'Europe/Vilnius',
    population: '600,000',
    coordinates: '54.6872° N, 25.2797° E',
  },
  'riga': {
    name: 'Riga',
    country: 'Latvia',
    timezone: 'Europe/Riga',
    population: '610,000',
    coordinates: '56.9496° N, 24.1052° E',
  },
  'tallinn': {
    name: 'Tallinn',
    country: 'Estonia',
    timezone: 'Europe/Tallinn',
    population: '450,000',
    coordinates: '59.4370° N, 24.7536° E',
  },

  // Asia (more)
  'jakarta': {
    name: 'Jakarta',
    country: 'Indonesia',
    timezone: 'Asia/Jakarta',
    population: '10.6 million',
    coordinates: '6.2088° S, 106.8456° E',
  },
  'manila': {
    name: 'Manila',
    country: 'Philippines',
    timezone: 'Asia/Manila',
    population: '1.8 million',
    coordinates: '14.5995° N, 120.9842° E',
  },
  'hanoi': {
    name: 'Hanoi',
    country: 'Vietnam',
    timezone: 'Asia/Ho_Chi_Minh',
    population: '8.4 million',
    coordinates: '21.0285° N, 105.8542° E',
  },
  'ho-chi-minh-city': {
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    timezone: 'Asia/Ho_Chi_Minh',
    population: '9.4 million',
    coordinates: '10.8231° N, 106.6297° E',
  },
  'karachi': {
    name: 'Karachi',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    population: '20 million',
    coordinates: '24.8607° N, 67.0011° E',
  },
  'lahore': {
    name: 'Lahore',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    population: '13 million',
    coordinates: '31.5204° N, 74.3587° E',
  },
  'islamabad': {
    name: 'Islamabad',
    country: 'Pakistan',
    timezone: 'Asia/Karachi',
    population: '1.2 million',
    coordinates: '33.6844° N, 73.0479° E',
  },
  'dhaka': {
    name: 'Dhaka',
    country: 'Bangladesh',
    timezone: 'Asia/Dhaka',
    population: '10.2 million',
    coordinates: '23.8103° N, 90.4125° E',
  },
  'colombo': {
    name: 'Colombo',
    country: 'Sri Lanka',
    timezone: 'Asia/Colombo',
    population: '560,000',
    coordinates: '6.9271° N, 79.8612° E',
  },
  'kathmandu': {
    name: 'Kathmandu',
    country: 'Nepal',
    timezone: 'Asia/Kathmandu',
    population: '850,000',
    coordinates: '27.7172° N, 85.3240° E',
  },
  'tashkent': {
    name: 'Tashkent',
    country: 'Uzbekistan',
    timezone: 'Asia/Tashkent',
    population: '2.6 million',
    coordinates: '41.2995° N, 69.2401° E',
  },
  'almaty': {
    name: 'Almaty',
    country: 'Kazakhstan',
    timezone: 'Asia/Almaty',
    population: '2.1 million',
    coordinates: '43.2389° N, 76.8897° E',
  },
  'osaka': {
    name: 'Osaka',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    population: '2.7 million',
    coordinates: '34.6937° N, 135.5023° E',
  },
  'shenzhen': {
    name: 'Shenzhen',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '17.5 million',
    coordinates: '22.5431° N, 114.0579° E',
  },
  'guangzhou': {
    name: 'Guangzhou',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '18.7 million',
    coordinates: '23.1291° N, 113.2644° E',
  },
  'chengdu': {
    name: 'Chengdu',
    country: 'China',
    timezone: 'Asia/Shanghai',
    population: '20.9 million',
    coordinates: '30.5728° N, 104.0668° E',
  },
  'macau': {
    name: 'Macau',
    country: 'Macau',
    timezone: 'Asia/Macau',
    population: '680,000',
    coordinates: '22.1987° N, 113.5439° E',
  },
  'ulaanbaatar': {
    name: 'Ulaanbaatar',
    country: 'Mongolia',
    timezone: 'Asia/Ulaanbaatar',
    population: '1.6 million',
    coordinates: '47.8864° N, 106.9057° E',
  },
  'yangon': {
    name: 'Yangon',
    country: 'Myanmar',
    timezone: 'Asia/Yangon',
    population: '5.2 million',
    coordinates: '16.8661° N, 96.1951° E',
  },
  'phnom-penh': {
    name: 'Phnom Penh',
    country: 'Cambodia',
    timezone: 'Asia/Phnom_Penh',
    population: '2.3 million',
    coordinates: '11.5564° N, 104.9282° E',
  },
  'bangalore': {
    name: 'Bangalore',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '8.4 million',
    coordinates: '12.9716° N, 77.5946° E',
  },
  'chennai': {
    name: 'Chennai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '4.6 million',
    coordinates: '13.0827° N, 80.2707° E',
  },
  'hyderabad': {
    name: 'Hyderabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
    population: '6.8 million',
    coordinates: '17.3850° N, 78.4867° E',
  },
  'baku': {
    name: 'Baku',
    country: 'Azerbaijan',
    timezone: 'Asia/Baku',
    population: '2.3 million',
    coordinates: '40.4093° N, 49.8671° E',
  },
  'tbilisi': {
    name: 'Tbilisi',
    country: 'Georgia',
    timezone: 'Asia/Tbilisi',
    population: '1.2 million',
    coordinates: '41.7151° N, 44.8271° E',
  },
  'yerevan': {
    name: 'Yerevan',
    country: 'Armenia',
    timezone: 'Asia/Yerevan',
    population: '1.1 million',
    coordinates: '40.1792° N, 44.4991° E',
  },

  // Middle East (more)
  'tehran': {
    name: 'Tehran',
    country: 'Iran',
    timezone: 'Asia/Tehran',
    population: '9.5 million',
    coordinates: '35.6892° N, 51.3890° E',
  },
  'baghdad': {
    name: 'Baghdad',
    country: 'Iraq',
    timezone: 'Asia/Baghdad',
    population: '7.7 million',
    coordinates: '33.3152° N, 44.3661° E',
  },
  'beirut': {
    name: 'Beirut',
    country: 'Lebanon',
    timezone: 'Asia/Beirut',
    population: '360,000',
    coordinates: '33.8938° N, 35.5018° E',
  },
  'amman': {
    name: 'Amman',
    country: 'Jordan',
    timezone: 'Asia/Amman',
    population: '4 million',
    coordinates: '31.9454° N, 35.9284° E',
  },
  'abu-dhabi': {
    name: 'Abu Dhabi',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
    population: '1.5 million',
    coordinates: '24.4539° N, 54.3773° E',
  },

  // Oceania (more)
  'adelaide': {
    name: 'Adelaide',
    country: 'Australia',
    timezone: 'Australia/Adelaide',
    population: '1.4 million',
    coordinates: '34.9285° S, 138.6007° E',
  },
  'darwin': {
    name: 'Darwin',
    country: 'Australia',
    timezone: 'Australia/Darwin',
    population: '140,000',
    coordinates: '12.4634° S, 130.8456° E',
  },
  'hobart': {
    name: 'Hobart',
    country: 'Australia',
    timezone: 'Australia/Hobart',
    population: '250,000',
    coordinates: '42.8821° S, 147.3272° E',
  },
  'canberra': {
    name: 'Canberra',
    country: 'Australia',
    timezone: 'Australia/Sydney',
    population: '460,000',
    coordinates: '35.2809° S, 149.1300° E',
  },
  'christchurch': {
    name: 'Christchurch',
    country: 'New Zealand',
    timezone: 'Pacific/Auckland',
    population: '390,000',
    coordinates: '43.5321° S, 172.6362° E',
  },
  'port-moresby': {
    name: 'Port Moresby',
    country: 'Papua New Guinea',
    timezone: 'Pacific/Port_Moresby',
    population: '370,000',
    coordinates: '9.4438° S, 147.1803° E',
  },

  // South America (more)
  'caracas': {
    name: 'Caracas',
    country: 'Venezuela',
    timezone: 'America/Caracas',
    population: '2.9 million',
    coordinates: '10.4806° N, 66.9036° W',
  },
  'quito': {
    name: 'Quito',
    country: 'Ecuador',
    timezone: 'America/Guayaquil',
    population: '1.8 million',
    coordinates: '0.1807° S, 78.4678° W',
  },
  'la-paz': {
    name: 'La Paz',
    country: 'Bolivia',
    timezone: 'America/La_Paz',
    population: '760,000',
    coordinates: '16.4897° S, 68.1193° W',
  },
  'montevideo': {
    name: 'Montevideo',
    country: 'Uruguay',
    timezone: 'America/Montevideo',
    population: '1.3 million',
    coordinates: '34.9011° S, 56.1645° W',
  },
  'asuncion': {
    name: 'Asunción',
    country: 'Paraguay',
    timezone: 'America/Asuncion',
    population: '520,000',
    coordinates: '25.2637° S, 57.5759° W',
  },
  'brasilia': {
    name: 'Brasília',
    country: 'Brazil',
    timezone: 'America/Sao_Paulo',
    population: '2.8 million',
    coordinates: '15.7939° S, 47.8828° W',
  },
  'medellin': {
    name: 'Medellín',
    country: 'Colombia',
    timezone: 'America/Bogota',
    population: '2.5 million',
    coordinates: '6.2476° N, 75.5658° W',
  },

  // Africa (more)
  'addis-ababa': {
    name: 'Addis Ababa',
    country: 'Ethiopia',
    timezone: 'Africa/Addis_Ababa',
    population: '3.5 million',
    coordinates: '9.0320° N, 38.7469° E',
  },
  'accra': {
    name: 'Accra',
    country: 'Ghana',
    timezone: 'Africa/Accra',
    population: '2.5 million',
    coordinates: '5.6037° N, 0.1870° W',
  },
  'algiers': {
    name: 'Algiers',
    country: 'Algeria',
    timezone: 'Africa/Algiers',
    population: '2.9 million',
    coordinates: '36.7538° N, 3.0588° E',
  },
  'tunis': {
    name: 'Tunis',
    country: 'Tunisia',
    timezone: 'Africa/Tunis',
    population: '640,000',
    coordinates: '36.8065° N, 10.1815° E',
  },
  'dar-es-salaam': {
    name: 'Dar es Salaam',
    country: 'Tanzania',
    timezone: 'Africa/Dar_es_Salaam',
    population: '5.4 million',
    coordinates: '6.7924° S, 39.2083° E',
  },
  'kinshasa': {
    name: 'Kinshasa',
    country: 'DR Congo',
    timezone: 'Africa/Kinshasa',
    population: '17 million',
    coordinates: '4.4419° S, 15.2663° E',
  },
  'luanda': {
    name: 'Luanda',
    country: 'Angola',
    timezone: 'Africa/Luanda',
    population: '9 million',
    coordinates: '8.8390° S, 13.2894° E',
  },
  'dakar': {
    name: 'Dakar',
    country: 'Senegal',
    timezone: 'Africa/Dakar',
    population: '1.2 million',
    coordinates: '14.7167° N, 17.4677° W',
  },
  'kampala': {
    name: 'Kampala',
    country: 'Uganda',
    timezone: 'Africa/Kampala',
    population: '1.7 million',
    coordinates: '0.3476° N, 32.5825° E',
  },
  'harare': {
    name: 'Harare',
    country: 'Zimbabwe',
    timezone: 'Africa/Harare',
    population: '1.5 million',
    coordinates: '17.8252° S, 31.0335° E',
  },
  'abidjan': {
    name: 'Abidjan',
    country: 'Ivory Coast',
    timezone: 'Africa/Abidjan',
    population: '5.6 million',
    coordinates: '5.3600° N, 4.0083° W',
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
    images: OG_IMAGES,
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
    images: OG_IMAGES,
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
    images: OG_IMAGES,
      title: `${cityInfo.name} Time | Current Local Time`,
      description: `Check the current local time in ${cityInfo.name}, ${cityInfo.country}`,
      type: 'website',
    },
  };
}