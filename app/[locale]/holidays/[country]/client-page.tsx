"use client"

import HolidayCalendar from "@/components/holiday-calendar"
import { Holiday } from "@/lib/holidays"

interface CountryHolidaysClientProps {
  countryCode: string;
  countryName: string;
  initialYear: number;
  initialLanguage: string;
  initialHolidays: Holiday[];
}

export default function CountryHolidaysClientPage(props: CountryHolidaysClientProps) {
  return <HolidayCalendar {...props} />
}
