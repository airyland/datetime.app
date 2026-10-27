"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { TimezonePicker } from "@/components/timezone-picker"
import { getTimezoneSearchOptions } from "@/lib/timezone-options"
import TimezoneTimeline from '@/components/timezone-timeline'
import { HomeSeoSections } from '@/components/home-seo'
import { HomeUpcoming } from '@/components/home-upcoming'
import { Section, SectionHeading, CardList, RowLink, Faq, Pill, Eyebrow, h2Class, monoLabel, cardClass } from '@/components/ds'
import { ChevronDown, ChevronLeft, ChevronRight, ArrowLeftRight, Copy, Check, Maximize2, Moon, Sun, Sunrise, Sunset, Calendar, Calculator, Globe, Gift, Clock, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FullscreenTime } from '@/components/fullscreen-time'
import spacetime from 'spacetime'
import { getCurrentLocale, getLocalePath } from '@/lib/locale-utils'
import Link from 'next/link'

// Small pill used for DST markers
const DSTTag = ({ text }: { text: string }) => (
  <span className="rounded-full border border-line2 px-[7px] py-px font-mono text-[11px] tracking-[.06em]">{text}</span>
)

const labelCls = "mb-1.5 block text-[12.5px] font-medium text-subtle"
const fieldCls = "h-[46px] w-full rounded-[10px] border border-line2 bg-paper px-3.5 text-[15px] text-ink outline-none transition-colors focus:border-ink disabled:opacity-60"
const primaryBtn = "inline-flex h-12 items-center justify-center rounded-[10px] bg-ink px-6 text-[15px] font-medium text-btn-ink transition-opacity hover:opacity-90 disabled:opacity-60"
const ghostBtn = "inline-flex h-12 items-center justify-center rounded-[10px] border border-line2 bg-transparent px-6 text-[15px] font-medium transition-colors hover:bg-paper"
const iconBtn = "inline-flex items-center justify-center rounded-full border border-line bg-transparent transition-colors hover:border-line2 hover:bg-surface"
const resultPanel = "flex min-w-0 flex-[1_1_320px] flex-col justify-center rounded-[14px] border border-line bg-paper p-[clamp(20px,3vw,32px)]"
const panelWrap = "flex flex-wrap gap-x-14 gap-y-8 px-[clamp(20px,3vw,36px)] pb-[clamp(20px,3vw,36px)] pt-[clamp(14px,2vw,22px)]"
const panelTitle = "m-0 px-[clamp(20px,3vw,36px)] pt-[clamp(20px,3vw,32px)] text-xl font-semibold tracking-[-0.02em]"

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-[15px] top-[16px] size-3.5" strokeWidth={2} />
    </div>
  )
}

// Define timezone type
type TimezoneOption = {
  value: string
  label: string
  isLocal?: boolean
}

// Available timezones for selection
const availableTimezones: TimezoneOption[] = [
  // North America
  { value: "America/New_York", label: "New York" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "America/Mexico_City", label: "Mexico City" },
  { value: "America/Phoenix", label: "Phoenix" },
  { value: "America/Denver", label: "Denver" },
  { value: "America/Montreal", label: "Montreal" },
  // Europe
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Europe/Rome", label: "Rome" },
  { value: "Europe/Madrid", label: "Madrid" },
  { value: "Europe/Amsterdam", label: "Amsterdam" },
  { value: "Europe/Moscow", label: "Moscow" },
  // Asia
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Seoul", label: "Seoul" },
  { value: "Asia/Taipei", label: "Taipei" },
  { value: "Asia/Bangkok", label: "Bangkok" },
  // Oceania
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Australia/Melbourne", label: "Melbourne" },
  { value: "Pacific/Auckland", label: "Auckland" },
  // India
  { value: "Asia/Kolkata", label: "India (IST)" },
]

// Featured cities for quick access
const featuredCities = [
  'new-york', 'london', 'tokyo', 'paris', 'sydney', 'beijing'
]

// Tools configuration
const toolsConfig = [
  { path: '/year-progress-bar', icon: Calendar, titleKey: 'tools.titleYearProgress', labelKey: 'tools.yearProgress' },
  { path: '/age-calculator', icon: Calculator, titleKey: 'tools.titleAgeCalculator', labelKey: 'tools.ageCalculator' },
  { path: '/utc', icon: Globe, titleKey: 'tools.titleUtcTime', labelKey: 'tools.utcTime' },
  { path: '/holidays', icon: Gift, titleKey: 'tools.titleWorldHolidays', labelKey: 'tools.worldHolidays' },
  { path: '/iana-timezones', icon: Clock, titleKey: 'tools.titleTimezones', labelKey: 'tools.timezones' }
]

// Global cities organized by region
const globalCitiesByRegion = {
  northAmerica: {
    title: 'globalCities.northAmerica',
    cities: [
      'new-york', 'los-angeles', 'chicago', 'toronto', 'vancouver', 'mexico-city',
      'houston', 'miami', 'atlanta', 'boston', 'seattle', 'san-francisco',
      'washington-dc', 'philadelphia', 'dallas', 'denver', 'phoenix', 'las-vegas',
      'san-diego', 'honolulu', 'anchorage', 'montreal', 'calgary', 'ottawa',
      'edmonton', 'guadalajara', 'monterrey', 'havana', 'panama-city', 'kingston',
      'guatemala-city'
    ]
  },
  europe: {
    title: 'globalCities.europe',
    cities: [
      'london', 'paris', 'berlin', 'rome', 'madrid', 'amsterdam',
      'moscow', 'vienna', 'prague', 'brussels', 'zurich', 'stockholm',
      'dublin', 'lisbon', 'athens', 'warsaw', 'budapest', 'copenhagen',
      'oslo', 'helsinki', 'kyiv', 'bucharest', 'sofia', 'belgrade',
      'zagreb', 'reykjavik', 'edinburgh', 'manchester', 'barcelona', 'milan',
      'munich', 'frankfurt', 'saint-petersburg', 'vilnius', 'riga', 'tallinn'
    ]
  },
  asia: {
    title: 'globalCities.asia',
    cities: [
      'tokyo', 'beijing', 'shanghai', 'hong-kong', 'singapore', 'seoul',
      'bangkok', 'mumbai', 'delhi', 'dubai', 'taipei', 'kuala-lumpur',
      'jakarta', 'manila', 'hanoi', 'ho-chi-minh-city', 'karachi', 'lahore',
      'islamabad', 'dhaka', 'colombo', 'kathmandu', 'tashkent', 'almaty',
      'osaka', 'shenzhen', 'guangzhou', 'chengdu', 'macau', 'ulaanbaatar',
      'yangon', 'phnom-penh', 'bangalore', 'chennai', 'hyderabad', 'baku',
      'tbilisi', 'yerevan'
    ]
  },
  oceania: {
    title: 'globalCities.oceania',
    cities: [
      'sydney', 'melbourne', 'auckland', 'brisbane', 'perth', 'wellington',
      'adelaide', 'darwin', 'hobart', 'canberra', 'christchurch', 'port-moresby'
    ]
  },
  southAmerica: {
    title: 'globalCities.southAmerica',
    cities: [
      'sao-paulo', 'rio-de-janeiro', 'buenos-aires', 'lima', 'bogota', 'santiago',
      'caracas', 'quito', 'la-paz', 'montevideo', 'asuncion', 'brasilia',
      'medellin'
    ]
  },
  africa: {
    title: 'globalCities.africa',
    cities: [
      'cairo', 'johannesburg', 'cape-town', 'lagos', 'nairobi', 'casablanca',
      'addis-ababa', 'accra', 'algiers', 'tunis', 'dar-es-salaam', 'kinshasa',
      'luanda', 'dakar', 'kampala', 'harare', 'abidjan'
    ]
  },
  middleEast: {
    title: 'globalCities.middleEast',
    cities: [
      'istanbul', 'tel-aviv', 'jerusalem', 'riyadh', 'doha', 'kuwait-city',
      'tehran', 'baghdad', 'beirut', 'amman', 'abu-dhabi'
    ]
  }
}

export default function Home() {
  const t = useTranslations('home')
  const commonT = useTranslations('common')
  const citiesT = useTranslations('cities')
  const pathname = usePathname()
  
  const currentLocale = getCurrentLocale(pathname)

  // Helper function to generate locale-aware paths
  const localePath = (path: string) => getLocalePath(path, currentLocale)

  const seoT = useTranslations('homeSeo')
  const faqItems = [
    ...['utcGmt', 'timezones', 'unixTimestamp', 'clockAccuracy', 'iso8601', 'daylightSaving', 'timezoneConversion'].map((k) => ({ q: t(`faq.${k}.question`), a: t(`faq.${k}.answer`) })),
    ...[1, 2, 3, 4].map((n) => ({ q: seoT(`faq.q${n}`), a: seoT(`faq.a${n}`) })),
  ]

  // Helper function to get translated city name
  const getCityName = (cityKey: string) => {
    try {
      return citiesT(`cityNames.${cityKey}`)
    } catch {
      // Fallback to formatted city key if translation is missing
      return cityKey.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
  }
  const [currentTime, setCurrentTime] = useState(new Date())
  const [customTimezones, setCustomTimezones] = useState<TimezoneOption[]>([]) // Custom timezones for both world clock and timeline
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calMonth, setCalMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [activeRegion, setActiveRegion] = useState<string>("northAmerica")
  const [fromTimezone, setFromTimezone] = useState("UTC")
  const [toTimezone, setToTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [convertTime, setConvertTime] = useState("12:00")
  const [convertDate, setConvertDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [convertedTime, setConvertedTime] = useState("")
  const [countdownHours, setCountdownHours] = useState("0")
  const [countdownMinutes, setCountdownMinutes] = useState("0")
  const [countdownSeconds, setCountdownSeconds] = useState("0")
  const [countdownRunning, setCountdownRunning] = useState(false)
  const [countdownTimeLeft, setCountdownTimeLeft] = useState("")
  const [sunriseSunset, setSunriseSunset] = useState({ sunrise: "", sunset: "" })
  // const [location, setLocation] = useState("") // Removed location state
  const [isFetchingSunTimes, setIsFetchingSunTimes] = useState(false)
  const [accuracy, setAccuracy] = useState({ offset: 0, latency: 0 })
  const [activeTab, setActiveTab] = useState("converter")
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [use24Hour, setUse24Hour] = useState(true)

  // Initialize time format preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('timeFormat')
      if (saved === '12h') {
        setUse24Hour(false)
      }
    }
  }, [])

  // Save time format preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('timeFormat', use24Hour ? '24h' : '12h')
    }
  }, [use24Hour])

  const [isInitialized, setIsInitialized] = useState(false)

  // Offsets only change at DST boundaries, so recompute the (large) option list every 10 minutes at most
  const pickerBucket = Math.floor(currentTime.getTime() / 600_000)
  const pickerOptions = useMemo(() => {
    const at = new Date(pickerBucket * 600_000)
    const out: { value: string; label: string; meta: string; keywords: string }[] = []
    for (const o of getTimezoneSearchOptions()) {
      if (customTimezones.some((ct) => ct.value === o.tz && ct.label === o.label)) continue
      try {
        const off = spacetime(at, o.tz).timezone().current.offset
        out.push({ value: o.key, label: o.label, meta: `GMT${off >= 0 ? `+${off}` : off}`, keywords: o.keywords })
      } catch {
        // zone newer than spacetime's bundled tz data (e.g. America/Coyhaique): the timeline couldn't render it, so don't offer it
      }
    }
    return out
  }, [pickerBucket, customTimezones])


  // Load custom timezones from localStorage
  useEffect(() => {
    // Load custom timezones from localStorage
    const saved = localStorage.getItem('customTimezones')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomTimezones(parsed)
      } catch (e) {
        console.error('Failed to parse saved timezones:', e)
        // Default timezones
        const defaultTimezones = [
          { value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: 'Local', isLocal: true },
          { value: 'America/New_York', label: 'New York' },
          { value: 'Europe/London', label: 'London' }
        ]
        setCustomTimezones(defaultTimezones)
      }
    } else {
      // Default timezones
      const defaultTimezones = [
        { value: Intl.DateTimeFormat().resolvedOptions().timeZone, label: 'Local', isLocal: true },
        { value: 'America/New_York', label: 'New York' },
        { value: 'Europe/London', label: 'London' }
      ]
      setCustomTimezones(defaultTimezones)
    }
    
    setIsInitialized(true)
  }, [])

  // Save custom timezones to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('customTimezones', JSON.stringify(customTimezones))
    }
  }, [customTimezones, isInitialized])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate time accuracy
      const start = performance.now()
      fetch("https://worldtimeapi.org/api/ip")
        .then((response) => response.json())
        .then((data) => {
          const end = performance.now()
          const serverTime = new Date(data.datetime)
          const clientTime = new Date()
          const offset = Math.abs(serverTime.getTime() - clientTime.getTime())
          setAccuracy({
            offset: offset,
            latency: end - start,
          })
        })
        .catch(() => {
          // If API fails, don't update accuracy
        })
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  // Countdown timer logic
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null

    if (countdownRunning) {
      let totalSeconds =
        Number.parseInt(countdownHours) * 3600 +
        Number.parseInt(countdownMinutes) * 60 +
        Number.parseInt(countdownSeconds)

      if (totalSeconds <= 0) {
        setCountdownRunning(false)
        setCountdownTimeLeft("Finished!")
        return
      }

      countdownInterval = setInterval(() => {
        totalSeconds -= 1

        if (totalSeconds <= 0) {
          setCountdownRunning(false)
          setCountdownTimeLeft("Finished!")
          if (countdownInterval) clearInterval(countdownInterval)
          return
        }

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        setCountdownTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }, 1000)
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [countdownRunning, countdownHours, countdownMinutes, countdownSeconds])

  // Get timezone info using spacetime
  const localTime = spacetime(currentTime)
  const timezone = localTime.timezone().name
  const offset = localTime.timezone().current.offset
  const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`
  const isDST = localTime.isDST()

  // Format time based on 12/24 hour preference
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hourCycle: use24Hour ? "h23" : "h12",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replace(/\s+(?:AM|PM)/, '')
  const heroHm = formattedTime.slice(0, 5)
  const heroSs = formattedTime.slice(5)
  const heroAp = use24Hour ? "" : currentTime.getHours() < 12 ? "AM" : "PM"

  // Format date
  const formattedDate = currentTime.toLocaleDateString(currentLocale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  // Handle fetching sun times
  const handleGetSunTimes = () => {
    setIsFetchingSunTimes(true);
    setSunriseSunset({ sunrise: "Loading...", sunset: "Loading..." });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto&current_weather=false&forecast_days=1`;
          
          fetch(apiUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              if (data.daily && data.daily.sunrise && data.daily.sunset) {
                const sunriseISO = data.daily.sunrise[0];
                const sunsetISO = data.daily.sunset[0];
                setSunriseSunset({
                  sunrise: new Date(sunriseISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  sunset: new Date(sunsetISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                });
              } else {
                setSunriseSunset({ sunrise: "API Error", sunset: "API Error" });
              }
            })
            .catch(() => {
              setSunriseSunset({ sunrise: "API Error", sunset: "API Error" });
            })
            .finally(() => {
              setIsFetchingSunTimes(false);
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location N/A";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location access denied";
          }
          setSunriseSunset({ sunrise: errorMessage, sunset: errorMessage });
          setIsFetchingSunTimes(false);
        }
      );
    } else {
      setSunriseSunset({ sunrise: "Geolocation not supported", sunset: "Geolocation not supported" });
      setIsFetchingSunTimes(false);
    }
  };

  // Unix timestamp
  const timestamp = Math.floor(currentTime.getTime() / 1000)

  // UTC time
  const utcTime = currentTime.toUTCString()

  // ISO format
  const isoTime = currentTime.toISOString()

  // Handle timezone conversion using spacetime
  const handleConvertTime = () => {
    try {
      const dateTimeStr = `${convertDate}T${convertTime}:00`
      
      // Create spacetime object in source timezone
      const st = spacetime(dateTimeStr, fromTimezone)
      
      // Convert to target timezone
      const converted = st.goto(toTimezone)
      
      const month = converted.monthName().charAt(0).toUpperCase() + converted.monthName().slice(1)
      const day = converted.date()
      const year = converted.year()
      const hour = converted.hour()
      const minute = converted.minute()
      const second = converted.second()
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 || 12
      
      setConvertedTime(
        `${month} ${day}, ${year} ${hour12}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')} ${ampm} (UTC${converted.timezone().current.offset})`
      )
    } catch (error) {
      setConvertedTime("Invalid date or time format")
    }
  }

  // Start countdown timer
  const startCountdown = () => {
    const hours = Number.parseInt(countdownHours) || 0
    const minutes = Number.parseInt(countdownMinutes) || 0
    const seconds = Number.parseInt(countdownSeconds) || 0

    if (hours === 0 && minutes === 0 && seconds === 0) {
      setCountdownTimeLeft("Please set a time greater than zero")
      return
    }

    setCountdownRunning(true)
    setCountdownTimeLeft(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    )
  }

  // Reset countdown timer
  const resetCountdown = () => {
    setCountdownRunning(false)
    setCountdownHours("0")
    setCountdownMinutes("0")
    setCountdownSeconds("0")
    setCountdownTimeLeft("")
  }

  // Copy to clipboard function with feedback
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    }).catch(console.error)
  }

  // ---- derived values for the redesigned layout ----
  const titleParts = commonT('title').split(' - ')
  const tzShort = (id: string) => id.split('/').pop()!.replace(/_/g, ' ')

  const toolTabs = [
    { id: "converter", label: t('tabs.converter') },
    { id: "timer", label: t('tabs.timer') },
    { id: "sun", label: t('tabs.sunTimes') },
    { id: "calendar", label: t('tabs.calendar') },
  ]

  // Calendar grid
  const calYear = calMonth.getFullYear()
  const calMon = calMonth.getMonth()
  const calLead = new Date(calYear, calMon, 1).getDay()
  const calDays = new Date(calYear, calMon + 1, 0).getDate()
  const calCells = Array.from({ length: Math.ceil((calLead + calDays) / 7) * 7 }, (_, i) => i - calLead + 1)
  const weekdayNames = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, 1 + i).toLocaleDateString(currentLocale, { weekday: "short" }))
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const dayOfYear = (d: Date) => Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

  const readouts: { key: string; label: React.ReactNode; value: string; copyText: string }[] = [
    { key: 'tz', label: t('labels.timezoneInfo'), value: `${timezone} (GMT${offsetStr})${isDST ? ` · ${t('labels.dst')}` : ''}`, copyText: timezone },
    { key: 'timestamp', label: t('labels.unixTimestamp'), value: String(timestamp), copyText: String(timestamp) },
    {
      key: 'utc',
      label: (
        <Link href={localePath('/utc')} className="inline-flex items-center gap-1 hover:text-ink hover:underline" title={t('labels.titleUtcTime')}>
          {t('labels.utcTime')}
          <Globe className="size-3" />
        </Link>
      ),
      value: utcTime,
      copyText: utcTime,
    },
    { key: 'iso', label: t('labels.isoFormat'), value: isoTime, copyText: isoTime },
  ]

  // Featured city tiles
  const cityTz: Record<string, { tz: string; cc: string }> = {
    'new-york': { tz: 'America/New_York', cc: 'US' },
    london: { tz: 'Europe/London', cc: 'GB' },
    tokyo: { tz: 'Asia/Tokyo', cc: 'JP' },
    paris: { tz: 'Europe/Paris', cc: 'FR' },
    sydney: { tz: 'Australia/Sydney', cc: 'AU' },
    beijing: { tz: 'Asia/Shanghai', cc: 'CN' },
  }
  const cityTiles = featuredCities.map((cityKey) => {
    const info = cityTz[cityKey]
    const cs = info ? spacetime(currentTime, info.tz) : null
    const h = cs ? cs.hour() : 12
    const m = cs ? cs.minute() : 0
    const off = cs ? cs.timezone().current.offset : 0
    const night = !(h >= 6 && h < 18)
    return { cityKey, info, h, m, off, night }
  })

  const regionEntries = Object.entries(globalCitiesByRegion)

  return (
    <main className="flex min-h-screen flex-col bg-paper text-ink">
      {/* ============ Hero ============ */}
      <Section top="clamp(20px,4vw,44px)">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <h1 className="m-0 max-w-[520px] text-[clamp(22px,2.4vw,28px)] font-semibold leading-[1.15] tracking-[-0.02em]">
            <span className="block">{titleParts[0]}</span>
            {titleParts.length > 1 && (
              <span className="mt-2 block text-[15px] font-normal leading-normal tracking-normal text-subtle">{titleParts[1]}</span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Time format" className="inline-flex rounded-full border border-line bg-surface p-[3px]">
              {[false, true].map((is24) => {
                const on = use24Hour === is24
                return (
                  <button
                    key={String(is24)}
                    type="button"
                    onClick={() => setUse24Hour(is24)}
                    aria-pressed={on}
                    className={cn("h-8 min-w-[52px] rounded-full px-3 font-mono text-[13px] transition-colors", on ? "bg-ink text-btn-ink" : "text-ink")}
                  >
                    {is24 ? "24h" : "12h"}
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => setIsFullscreen(true)} aria-label="Enter fullscreen" title="Enter fullscreen" className={cn(iconBtn, "size-10")}>
              <Maximize2 className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <h2 className={cn("m-0 mt-[clamp(36px,6vw,76px)] flex flex-wrap items-center gap-x-3 gap-y-1.5 font-normal tracking-[.08em]", monoLabel)}>
          <span>{t('localTime')}</span>
          <span aria-hidden="true">/</span>
          <span suppressHydrationWarning>{timezone}</span>
          <span className="text-ink" suppressHydrationWarning>GMT{offsetStr}</span>
          {isDST && <DSTTag text={t('labels.dst')} />}
        </h2>

        <div
          onClick={() => setIsFullscreen(true)}
          title="Enter fullscreen"
          suppressHydrationWarning
          className="tnum -ml-[0.045em] mt-2.5 flex cursor-zoom-in items-baseline whitespace-nowrap font-mono text-[clamp(46px,13.6vw,190px)] font-light leading-none tracking-[-0.055em]"
        >
          <span suppressHydrationWarning>{heroHm}</span>
          <span className="text-brand" suppressHydrationWarning>{heroSs}</span>
          {heroAp && <span className="ml-[.14em] text-[.15em] font-normal tracking-normal text-subtle">{heroAp}</span>}
        </div>

        <div aria-hidden="true" className="mt-[22px]">
          <div className="flex h-[30px] items-end justify-between">
            {Array.from({ length: 60 }, (_, i) => {
              const sec = currentTime.getSeconds()
              return (
                <span
                  key={i}
                  className={cn("block w-px rounded-[1px] min-[500px]:w-0.5", i === sec ? "bg-brand" : i < sec ? "bg-ink" : "bg-tick")}
                  style={{ height: i === sec ? 30 : i % 15 === 0 ? 22 : i % 5 === 0 ? 16 : 10 }}
                />
              )
            })}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-subtle">
            <span>00</span><span>15</span><span>30</span><span>45</span><span>60</span>
          </div>
        </div>

        <div className="mt-[34px] flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <Eyebrow>{currentTime.toLocaleDateString(currentLocale, { weekday: "long" })}</Eyebrow>
            <div suppressHydrationWarning className="mt-2 text-[clamp(28px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-0.035em]">
              {currentTime.toLocaleDateString(currentLocale, { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="inline-flex items-center gap-2.5 text-[13px] text-subtle">
            <span className="relative inline-block size-2">
              <span className="animate-ping-soft absolute inset-0 rounded-full bg-ok" />
              <span className="absolute inset-0 rounded-full bg-ok" />
            </span>
            {accuracy.offset > 1000 ? (
              <span>{t('labels.clockOffset', { seconds: Math.round(accuracy.offset / 1000) })}</span>
            ) : (
              <span>{t('labels.clockSynchronized', { offset: Math.round(accuracy.offset) })}</span>
            )}
          </div>
        </div>

        {/* Developer readouts */}
        <div className="mt-10">
          <h2 className={cn("m-0 mb-3 font-normal", monoLabel)}>{t('sections.developerTools')}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {readouts.map((r) => (
              <div key={r.key} className="flex min-w-0 items-center justify-between gap-3 bg-surface px-[18px] py-4">
                <div className="min-w-0">
                  <div className="mb-1 text-[12.5px] text-subtle">{r.label}</div>
                  <div className="tnum break-all font-mono text-sm leading-snug" suppressHydrationWarning>{r.value}</div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(r.copyText, r.key)}
                  aria-label="Copy to clipboard"
                  title="Copy to clipboard"
                  className="inline-flex size-[34px] flex-none items-center justify-center rounded-lg border border-transparent text-subtle transition-colors hover:border-line2 hover:bg-paper"
                >
                  {copiedStates[r.key] ? <Check className="size-4 text-ok" strokeWidth={2} /> : <Copy className="size-4" strokeWidth={1.75} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ World clock timeline ============ */}
      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading
          title={t('sections.worldClock')}
          right={
            <TimezonePicker
              label={t('labels.addTimezone')}
              onSelect={(key) => {
                const opt = getTimezoneSearchOptions().find((x) => x.key === key)
                if (opt && !customTimezones.some((ct) => ct.value === opt.tz && ct.label === opt.label)) {
                  setCustomTimezones((prev) => [...prev, { value: opt.tz, label: opt.label }])
                }
              }}
              options={pickerOptions}
            />
          }
        />
        <TimezoneTimeline
          timezones={customTimezones.map((tz) => ({ city: tz.label, name: tz.value, value: tz.value, isLocal: tz.isLocal }))}
          now={currentTime}
          use24Hour={use24Hour}
          dstLabel={t('labels.dst')}
          removeLabel="Remove timezone"
          onRemove={(value) => setCustomTimezones((prev) => prev.filter((x) => x.value !== value))}
        />
      </Section>

      {/* ============ Toolkit (all panels stay in the DOM) ============ */}
      <Section top="clamp(64px,9vw,112px)">
        <div className={cn(cardClass, "overflow-hidden rounded-[18px]")}>
          <div role="tablist" aria-label="Tools" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-3">
            {toolTabs.map((tab) => {
              const on = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn("-mb-px h-14 flex-none whitespace-nowrap border-b-2 bg-transparent px-4 text-[14.5px] font-medium transition-colors", on ? "border-ink text-ink" : "border-transparent text-subtle hover:text-ink")}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Converter */}
          <div id="panel-converter" role="tabpanel" aria-labelledby="tab-converter" className={activeTab === "converter" ? "block" : "hidden"}>
            <h2 className={panelTitle}>{t('sections.timeZoneConverter')}</h2>
            <div className={panelWrap}>
              <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[18px]">
                <div>
                  <label htmlFor="from-timezone" className={labelCls}>{t('labels.fromTimezone')}</label>
                  <SelectWrap>
                    <select id="from-timezone" value={fromTimezone} onChange={(e) => setFromTimezone(e.target.value)} className={cn(fieldCls, "appearance-none pr-10")}>
                      <option value="UTC">UTC</option>
                      {availableTimezones.map((tz) => {
                        const o = spacetime(currentTime, tz.value).timezone().current.offset
                        return <option key={tz.value} value={tz.value}>{`${tz.label} (GMT${o >= 0 ? `+${o}` : o})`}</option>
                      })}
                    </select>
                  </SelectWrap>
                </div>
                <div className="flex flex-wrap gap-3.5">
                  <div className="min-w-0 flex-[1_1_150px]">
                    <label htmlFor="convert-date" className={labelCls}>{t('labels.date')}</label>
                    <input id="convert-date" type="date" value={convertDate} onChange={(e) => setConvertDate(e.target.value)} className={cn(fieldCls, "font-mono text-sm")} />
                  </div>
                  <div className="min-w-0 flex-[1_1_130px]">
                    <label htmlFor="convert-time" className={labelCls}>{t('labels.time')}</label>
                    <input id="convert-time" type="time" value={convertTime} onChange={(e) => setConvertTime(e.target.value)} className={cn(fieldCls, "font-mono text-sm")} />
                  </div>
                </div>
                <div className="flex items-end gap-2.5">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="to-timezone" className={labelCls}>{t('labels.toTimezone')}</label>
                    <SelectWrap>
                      <select id="to-timezone" value={toTimezone} onChange={(e) => setToTimezone(e.target.value)} className={cn(fieldCls, "appearance-none pr-10")}>
                        <option value="UTC">UTC</option>
                        {availableTimezones.map((tz) => {
                          const o = spacetime(currentTime, tz.value).timezone().current.offset
                          return <option key={tz.value} value={tz.value}>{`${tz.label} (GMT${o >= 0 ? `+${o}` : o})`}</option>
                        })}
                        {!availableTimezones.some((tz) => tz.value === toTimezone) && toTimezone !== "UTC" && (
                          <option value={toTimezone}>{tzShort(toTimezone)}</option>
                        )}
                      </select>
                    </SelectWrap>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFromTimezone(toTimezone)
                      setToTimezone(fromTimezone)
                    }}
                    aria-label="Swap time zones"
                    title="Swap"
                    className="inline-flex size-[46px] flex-none items-center justify-center rounded-[10px] border border-line2 bg-transparent transition-colors hover:bg-paper"
                  >
                    <ArrowLeftRight className="size-[18px]" strokeWidth={1.75} />
                  </button>
                </div>
                <button type="button" className={cn(primaryBtn, "w-full")} onClick={handleConvertTime}>
                  {t('labels.convert')}
                </button>
              </div>
              <div className={resultPanel}>
                <h3 className={cn("m-0 font-normal", monoLabel)}>{t('labels.convertedTime')}</h3>
                <p className="tnum m-0 mt-3.5 break-words font-mono text-[clamp(22px,2.6vw,34px)] font-light leading-tight tracking-[-0.03em]">
                  {convertedTime || "--:--"}
                </p>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div id="panel-timer" role="tabpanel" aria-labelledby="tab-timer" className={activeTab === "timer" ? "block" : "hidden"}>
            <h2 className={panelTitle}>{t('sections.countdownTimer')}</h2>
            <div className={panelWrap}>
              <div className="min-w-0 flex-[1_1_380px]">
                <div className="flex gap-3.5">
                  {[
                    { id: "hours", label: t('labels.hours'), max: "23", value: countdownHours, set: setCountdownHours },
                    { id: "minutes", label: t('labels.minutes'), max: "59", value: countdownMinutes, set: setCountdownMinutes },
                    { id: "seconds", label: t('labels.seconds'), max: "59", value: countdownSeconds, set: setCountdownSeconds },
                  ].map((f) => (
                    <div key={f.id} className="min-w-0 flex-1">
                      <label htmlFor={f.id} className={labelCls}>{f.label}</label>
                      <input
                        id={f.id}
                        type="number"
                        min="0"
                        max={f.max}
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        disabled={countdownRunning}
                        className="tnum h-[60px] w-full rounded-[10px] border border-line2 bg-paper px-2 text-center font-mono text-[28px] font-light outline-none transition-colors focus:border-ink disabled:opacity-60"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  {!countdownRunning ? (
                    <button type="button" className={cn(primaryBtn, "flex-1")} onClick={startCountdown}>{t('labels.start')}</button>
                  ) : (
                    <button type="button" className={cn(primaryBtn, "flex-1")} onClick={() => setCountdownRunning(false)}>{t('labels.pause')}</button>
                  )}
                  <button type="button" className={cn(ghostBtn, "flex-1")} onClick={resetCountdown}>{t('labels.reset')}</button>
                </div>
              </div>
              <div className={resultPanel}>
                <h3 className={cn("m-0 font-normal", monoLabel)}>{t('labels.timeRemaining')}</h3>
                <p className={cn("tnum m-0 mt-3.5 break-words font-mono text-[clamp(30px,5vw,64px)] font-light leading-none tracking-[-0.05em]", countdownRunning ? "text-brand" : "text-ink")}>
                  {countdownTimeLeft || "00:00:00"}
                </p>
              </div>
            </div>
          </div>

          {/* Sun times */}
          <div id="panel-sun" role="tabpanel" aria-labelledby="tab-sun" className={activeTab === "sun" ? "block" : "hidden"}>
            <h2 className={panelTitle}>{t('sections.sunriseSunset')}</h2>
            <div className={panelWrap}>
              <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-4">
                <div>
                  <button type="button" className={primaryBtn} onClick={handleGetSunTimes} disabled={isFetchingSunTimes}>
                    {isFetchingSunTimes ? t('labels.loading') : t('labels.getSunTimes')}
                  </button>
                </div>
              </div>
              <div className="grid min-w-0 flex-[1_1_320px] grid-cols-2 gap-3.5">
                <div className="min-w-0 rounded-[14px] border border-line bg-paper p-[clamp(16px,2.4vw,28px)]">
                  <Sunrise className="size-[22px]" strokeWidth={1.75} />
                  <h3 className="m-0 mt-[18px] text-[13px] font-normal text-subtle">{t('labels.sunrise')}</h3>
                  <p className={cn("tnum m-0 mt-1 break-words font-mono text-[clamp(20px,3.4vw,40px)] font-light tracking-[-0.04em]", sunriseSunset.sunrise ? "text-ink" : "text-subtle")}>{sunriseSunset.sunrise || "--:--"}</p>
                </div>
                <div className="min-w-0 rounded-[14px] border border-line bg-paper p-[clamp(16px,2.4vw,28px)]">
                  <Sunset className="size-[22px]" strokeWidth={1.75} />
                  <h3 className="m-0 mt-[18px] text-[13px] font-normal text-subtle">{t('labels.sunset')}</h3>
                  <p className={cn("tnum m-0 mt-1 break-words font-mono text-[clamp(20px,3.4vw,40px)] font-light tracking-[-0.04em]", sunriseSunset.sunset ? "text-ink" : "text-subtle")}>{sunriseSunset.sunset || "--:--"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div id="panel-calendar" role="tabpanel" aria-labelledby="tab-calendar" className={activeTab === "calendar" ? "block" : "hidden"}>
            <h2 className={panelTitle}>{t('sections.calendar')}</h2>
            <div className={panelWrap}>
              <div className="min-w-0 max-w-[440px] flex-[1_1_300px]">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="text-[17px] font-medium tracking-[-0.015em]">
                    {calMonth.toLocaleDateString(currentLocale, { month: "long", year: "numeric" })}
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" aria-label="Previous month" onClick={() => setCalMonth(new Date(calYear, calMon - 1, 1))} className="inline-flex size-9 items-center justify-center rounded-lg border border-line2 bg-transparent transition-colors hover:bg-paper">
                      <ChevronLeft className="size-4" strokeWidth={2} />
                    </button>
                    <button type="button" aria-label="Next month" onClick={() => setCalMonth(new Date(calYear, calMon + 1, 1))} className="inline-flex size-9 items-center justify-center rounded-lg border border-line2 bg-transparent transition-colors hover:bg-paper">
                      <ChevronRight className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <div className="mb-1.5 grid grid-cols-7 gap-0.5 text-center font-mono text-[11.5px] text-subtle">
                  {weekdayNames.map((w, i) => <span key={i}>{w}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {calCells.map((n, i) => {
                    const valid = n >= 1 && n <= calDays
                    const d = new Date(calYear, calMon, n)
                    const sel = valid && !!selectedDate && isSameDay(d, selectedDate)
                    const today = valid && isSameDay(d, currentTime)
                    return (
                      <button
                        key={i}
                        type="button"
                        tabIndex={valid ? 0 : -1}
                        aria-hidden={!valid}
                        aria-pressed={sel}
                        onClick={() => valid && setSelectedDate(d)}
                        className={cn(
                          "tnum h-11 rounded-lg border font-mono text-sm transition-colors",
                          !valid && "invisible",
                          sel ? "border-ink bg-ink text-btn-ink" : today ? "border-brand text-brand" : "border-transparent hover:bg-paper",
                        )}
                      >
                        {valid ? n : ""}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className={resultPanel}>
                {selectedDate && (
                  <>
                    <h3 className={cn("m-0 font-normal", monoLabel)}>Selected Date Information</h3>
                    <p className="m-0 mt-3 text-[clamp(20px,2.8vw,34px)] font-medium leading-[1.15] tracking-[-0.025em]">
                      {selectedDate.toLocaleDateString(currentLocale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <div className="mt-7 grid grid-cols-3 gap-3 border-t border-line pt-5">
                      <div className="min-w-0">
                        <div className="text-[12.5px] text-subtle">Day of Week:</div>
                        <div className="mt-1 text-base font-medium">{selectedDate.toLocaleDateString("en-US", { weekday: "long" })}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] text-subtle">Day of Year:</div>
                        <div className="tnum mt-1 font-mono text-base">{dayOfYear(selectedDate)}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] text-subtle">Week Number:</div>
                        <div className="tnum mt-1 font-mono text-base">{Math.ceil(dayOfYear(selectedDate) / 7)}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ Time tools ============ */}
      <Section top="clamp(64px,9vw,112px)">
        <div className="flex flex-wrap gap-x-16 gap-y-7">
          <div className="min-w-0 flex-[1_1_220px]">
            <h2 className={h2Class}>{t('tools.title')}</h2>
          </div>
          <CardList className="min-w-0 flex-[3_1_560px] rounded-[18px]">
            {toolsConfig.map((tool, i) => {
              const Icon = tool.icon
              return (
                <RowLink
                  key={tool.path}
                  href={localePath(tool.path)}
                  title={t(tool.titleKey)}
                  label={
                    <span className="inline-flex items-center gap-3.5">
                      <span className="font-mono text-[12.5px] font-normal text-subtle">{String(i + 1).padStart(2, '0')}</span>
                      <Icon className="size-[18px] text-subtle" strokeWidth={1.75} aria-hidden="true" />
                      {t(tool.labelKey)}
                    </span>
                  }
                />
              )
            })}
          </CardList>
        </div>
      </Section>

      {/* ============ World city times ============ */}
      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading title={t('cityTimes.title')} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,262px),1fr))] gap-2.5">
          {cityTiles.map(({ cityKey, info, h, m, off, night }) => {
            const time = use24Hour ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` : `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            const ap = use24Hour ? '' : h < 12 ? 'AM' : 'PM'
            const pos = ((h * 60 + m) / 1440) * 100
            return (
              <Link
                key={cityKey}
                href={localePath(`/cities/${cityKey}`)}
                title={t(`cityTimes.title${cityKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`)}
                className={cn(
                  "flex flex-col justify-between gap-3.5 rounded-xl border px-4 py-3.5 transition-colors",
                  night ? "border-night bg-night text-foot-ink hover:border-foot-muted" : "border-line bg-surface text-ink hover:border-ink",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium tracking-[-0.01em]">{getCityName(cityKey)}</div>
                    <div className={cn("mt-px font-mono text-[10.5px] tracking-[.06em]", night ? "text-foot-muted" : "text-subtle")}>
                      {info?.cc} · GMT{off >= 0 ? `+${off}` : off}
                    </div>
                  </div>
                  <span aria-hidden="true" className={night ? "text-foot-muted" : "text-subtle"}>
                    {night ? <Moon className="size-4" strokeWidth={1.75} /> : <Sun className="size-4" strokeWidth={1.75} />}
                  </span>
                </div>
                <div>
                  <div className="tnum whitespace-nowrap font-mono text-[30px] font-light leading-none tracking-[-0.05em]" suppressHydrationWarning>
                    {time}
                    {ap && <span className={cn("ml-[5px] text-[11px] font-normal tracking-normal", night ? "text-foot-muted" : "text-subtle")}>{ap}</span>}
                  </div>
                  <div aria-hidden="true" className="relative mt-3.5">
                    <div className="grid h-2 grid-cols-[repeat(24,minmax(0,1fr))] items-end gap-[1.5px]">
                      {Array.from({ length: 24 }, (_, i) => {
                        const day = i >= 8 && i < 18
                        const mid = (i >= 6 && i < 8) || (i >= 18 && i < 22)
                        return (
                          <span
                            key={i}
                            className={cn("block rounded-[1.5px]", night ? "bg-foot-ink" : "bg-ink")}
                            style={{ height: day ? '100%' : mid ? '65%' : '35%', opacity: day ? 0.85 : mid ? 0.5 : 0.25 }}
                          />
                        )
                      })}
                    </div>
                    <span className="absolute -inset-y-[3px] -ml-px w-0.5 rounded-[1px] bg-brand" style={{ left: `${pos}%` }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ============ Global cities directory (all regions stay in the DOM) ============ */}
      <Section top="clamp(64px,9vw,112px)">
        <SectionHeading
          title={t('globalCities.title')}
          right={
            <div role="tablist" aria-label="Regions" className="flex flex-wrap gap-1.5">
              {regionEntries.map(([regionKey, region]) => (
                <button
                  key={regionKey}
                  type="button"
                  role="tab"
                  id={`region-tab-${regionKey}`}
                  aria-selected={activeRegion === regionKey}
                  aria-controls={`region-${regionKey}`}
                  onClick={() => setActiveRegion(regionKey)}
                  className={cn(
                    "inline-flex h-[38px] items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-medium transition-colors",
                    activeRegion === regionKey ? "border-ink bg-ink text-btn-ink" : "border-line bg-surface text-ink hover:border-ink",
                  )}
                >
                  {t(region.title)}
                  <span className="font-mono text-[11.5px] opacity-60">{region.cities.length}</span>
                </button>
              ))}
            </div>
          }
        />
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
          {regionEntries.map(([regionKey, region]) => (
            <div
              key={regionKey}
              id={`region-${regionKey}`}
              role="tabpanel"
              aria-labelledby={`region-tab-${regionKey}`}
              className={activeRegion === regionKey ? "block" : "hidden"}
            >
              <h3 className="sr-only">{t(region.title)}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))]">
                {region.cities.map((cityKey, i) => (
                  <Link
                    key={cityKey}
                    href={localePath(`/cities/${cityKey}`)}
                    className="group flex items-center gap-2.5 px-3.5 py-[11px] text-sm font-medium tracking-[-0.01em] shadow-[inset_-1px_-1px_0_var(--line)] transition-colors hover:bg-paper"
                  >
                    <span className="min-w-[18px] flex-none font-mono text-[10.5px] font-normal text-subtle">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 flex-1 truncate">{getCityName(cityKey)}</span>
                    <ArrowUpRight aria-hidden="true" className="size-[13px] text-subtle transition-all group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-brand" strokeWidth={1.75} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <HomeUpcoming />
      <HomeSeoSections year={new Date().getUTCFullYear()} localePath={localePath} />

      {/* ============ FAQ (last) ============ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
      <Faq title={t('faq.title')} items={faqItems} />

      <FullscreenTime
        time={`${heroHm}${heroSs}`}
        isFullscreen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </main>
  )
}
