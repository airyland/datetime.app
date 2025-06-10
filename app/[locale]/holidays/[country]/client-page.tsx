"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Info } from "lucide-react"
import { Holiday, SUPPORTED_LANGUAGES } from "@/lib/holidays"

interface CountryHolidaysClientProps {
  countryCode: string;
  countryName: string;
  initialYear: number;
  initialLanguage: string;
  initialHolidays: Holiday[];
}

export default function CountryHolidaysClientPage({ 
  countryCode, 
  countryName, 
  initialYear, 
  initialLanguage,
  initialHolidays
}: CountryHolidaysClientProps) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage)
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Years for selection (current year +/- 5 years)
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i)
  
  // Load holidays when year or language changes
  useEffect(() => {
    // Only fetch if the selection changes from initial values
    if (selectedYear === initialYear && selectedLanguage === initialLanguage) {
      return;
    }
    
    const fetchHolidays = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/holidays?country=${countryCode}&year=${selectedYear}&language=${selectedLanguage}`);
        const data = await response.json();
        
        if (data.holidays && data.holidays.length > 0) {
          setHolidays(data.holidays);
        } else {
          setError("No holiday data available for this selection.");
        }
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setError("Failed to load holiday data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHolidays();
  }, [countryCode, selectedYear, selectedLanguage, initialYear, initialLanguage]);
  
  // Group holidays by month for better organization
  const holidaysByMonth: Record<string, Holiday[]> = {}
  
  holidays.forEach(holiday => {
    const date = new Date(holiday.start)
    const monthKey = date.toLocaleString('en-US', { month: 'long' })
    
    if (!holidaysByMonth[monthKey]) {
      holidaysByMonth[monthKey] = []
    }
    
    holidaysByMonth[monthKey].push(holiday)
  })
  
  // Sort months chronologically
  const sortedMonths = Object.keys(holidaysByMonth).sort((a, b) => {
    const monthA = new Date(`${a} 1, 2000`).getMonth()
    const monthB = new Date(`${b} 1, 2000`).getMonth()
    return monthA - monthB
  })
  
  // Get badge color based on holiday type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'public':
        return 'default'
      case 'bank':
        return 'secondary'
      case 'school':
        return 'outline'
      case 'observance':
        return 'destructive'
      default:
        return 'outline'
    }
  }
  
  return (
    <div>
      {/* Controls for year and language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Holidays display */}
      <div>
        {loading ? (
          <div className="text-center py-8">Loading holidays...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : holidays.length === 0 ? (
          <div className="text-center py-8">No holidays found for {countryName} in {selectedYear}.</div>
        ) : (
          <div className="space-y-8">
            {sortedMonths.map(month => (
              <div key={month}>
                <h3 className="text-lg font-semibold mb-4">{month}</h3>
                <div className="space-y-4">
                  {holidaysByMonth[month].map((holiday, index) => {
                    const date = new Date(holiday.start)
                    return (
                      <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-bold">{holiday.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long'
                            })}
                          </div>
                          {holiday.note && (
                            <div className="text-sm mt-1 flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              <span>{holiday.note}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge variant={getBadgeVariant(holiday.type)}>
                            {holiday.type}
                            {holiday.substitute && " (substitute)"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
