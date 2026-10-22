"use client"

import HolidayCalendar from "@/components/holiday-calendar"
import { Holiday } from "@/lib/holidays"

interface RegionHolidaysClientProps {
  countryCode: string;
  countryName: string;
  regionCode: string;
  regionName: string;
  initialYear: number;
  initialLanguage: string;
  initialHolidays: Holiday[];
}

export default function RegionHolidaysClientPage(props: RegionHolidaysClientProps) {
  return <HolidayCalendar {...props} />
}
