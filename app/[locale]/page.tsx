"use client"

import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Clock, Globe, CalendarIcon, Timer, ArrowLeftRight, Sun, Moon, AlertCircle, Copy, Check, Maximize2, Calendar, Calculator, Gift } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { JetBrains_Mono } from "next/font/google"
import { FullscreenTime } from '@/components/fullscreen-time'
import Header from '@/components/header'
import spacetime from 'spacetime'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

// DST tag component
const DSTTag = ({ text }: { text: string }) => (
  <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
    {text}
  </span>
)

// Available timezones for selection
const availableTimezones = [
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

export default function Home() {
  const t = useTranslations('home')
  const commonT = useTranslations('common')
  const pathname = usePathname()
  
  // Determine current locale from pathname as it's more reliable
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const locales = ['zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']
    if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
      return pathSegments[0]
    }
    return 'en'
  }
  
  // Use the more reliable method to get current locale
  const currentLocale = getCurrentLocale()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [customTimezones, setCustomTimezones] = useState<typeof availableTimezones>([]) // Custom user timezones
  const [showAddTimezone, setShowAddTimezone] = useState(false) // Control add timezone form
  const [fullscreenTime, setFullscreenTime] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
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
  const [activeTab, setActiveTab] = useState("current-time")
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [use24Hour, setUse24Hour] = useState(true)
  const [accordionValues, setAccordionValues] = useState<string[]>(["item-1","item-2","item-3","item-4","item-5","item-6","item-7"])

  // Initialize time format preference from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem('timeFormat')
    if (saved === '12h') {
      setUse24Hour(false)
    }
  }, [])

  // Save time format preference
  useEffect(() => {
    window.localStorage.setItem('timeFormat', use24Hour ? '24h' : '12h')
  }, [use24Hour])

  const [isInitialized, setIsInitialized] = useState(false)

  // Load custom timezones from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customTimezones')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomTimezones(parsed)
      } catch (e) {
        console.error('Failed to parse saved timezones:', e)
        // Show first 9 timezones by default
        setCustomTimezones(availableTimezones.slice(0, 9))
      }
    } else {
      // Show first 9 timezones by default
      setCustomTimezones(availableTimezones.slice(0, 9))
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

  useEffect(() => {
    setAccordionValues([])
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
    hour12: !use24Hour,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replace(/\s+(?:AM|PM)/, '')

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

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{commonT('title')}</h1>
        {/* SEO-friendly tabs that keep all content in the DOM */}
        <div className="w-full">
          {/* Tab navigation - improved for small screens */}
          <div className="flex justify-between md:justify-center md:space-x-4 mb-8 border-b overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("current-time")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "current-time"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "current-time"}
              role="tab"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.currentTime')}</span>
            </button>
            <button
              onClick={() => setActiveTab("world-clock")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "world-clock"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "world-clock"}
              role="tab"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.worldClock')}</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "calendar"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "calendar"}
              role="tab"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.calendar')}</span>
            </button>
            <button
              onClick={() => setActiveTab("converter")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "converter"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "converter"}
              role="tab"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.converter')}</span>
            </button>
            <button
              onClick={() => setActiveTab("timer")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "timer"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "timer"}
              role="tab"
            >
              <Timer className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.timer')}</span>
            </button>
            <button
              onClick={() => setActiveTab("sun")}
              className={`flex items-center justify-center gap-1 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "sun"
                  ? "border-black dark:border-white"
                  : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-selected={activeTab === "sun"}
              role="tab"
            >
              <Sun className="h-4 w-4" />
              <span className="hidden md:inline">{t('tabs.sunTimes')}</span>
            </button>
          </div>

          {/* Tab content - all content is rendered but only the active tab is visible */}

          {/* Current Time Tab */}
          <div
            className={`space-y-8 ${activeTab === "current-time" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "current-time"}
          >
            <div className="text-center">
              <div className="mb-8">
                <div className="flex flex-col items-center mb-2 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-medium">{t('localTime')}</h2>
                    <div className="flex items-center rounded-md bg-secondary/30 p-0.5 text-sm shadow-sm">
                      <button
                        onClick={() => setUse24Hour(false)}
                        className={`px-2.5 py-1 rounded-md transition-colors font-medium ${!use24Hour ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-secondary/50'}`}
                      >
                        12h
                      </button>
                      <button
                        onClick={() => setUse24Hour(true)}
                        className={`px-2.5 py-1 rounded-md transition-colors font-medium ${use24Hour ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-secondary/50'}`}
                      >
                        24h
                      </button>
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <div
                      className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none ${jetbrainsMono.className} text-center cursor-pointer`}
                      onClick={() => setIsFullscreen(true)}
                    >
                      {formattedTime}
                    </div>
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute top-2 -right-8 p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                      title="Enter fullscreen"
                    >
                      <Maximize2 size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
                    title="Enter fullscreen"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-xl md:text-2xl font-medium mt-2">{formattedDate}</div>

                {/* Time accuracy indicator */}
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {accuracy.offset > 1000 ? (
                    <span>
                      {t('labels.clockOffset', { seconds: Math.round(accuracy.offset / 1000) })}
                    </span>
                  ) : (
                    <span>{t('labels.clockSynchronized', { offset: Math.round(accuracy.offset) })}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
                <Card className="shadow-none rounded-none border">
                  <CardHeader className="py-2 px-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">{t('labels.timezoneInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <div className="flex items-center gap-2 justify-center">
                      <p className={jetbrainsMono.className}>{timezone} (GMT{offsetStr})</p>
                      {isDST && <DSTTag text={t('labels.dst')} />}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none rounded-none border">
                  <CardHeader className="py-2 px-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('labels.unixTimestamp')}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2">
                      <p className={jetbrainsMono.className}>{timestamp}</p>
                      <button
                        onClick={() => copyToClipboard(timestamp.toString(), 'timestamp')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                        title="Copy to clipboard"
                      >
                        {copiedStates['timestamp'] ? (
                          <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none rounded-none border">
                  <CardHeader className="py-2 px-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-4">
                      <a href="/utc" className="inline-flex items-center gap-1 hover:underline">
                        {t('labels.utcTime')}
                        <Globe className="h-3 w-3" />
                      </a>
                      <a href="/glossary/utc" className="text-xs text-muted-foreground hover:underline">{t('labels.learnAboutUtc')}</a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2">
                      <p className={jetbrainsMono.className}>{utcTime}</p>
                      <button
                        onClick={() => copyToClipboard(utcTime, 'utc')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                        title="Copy to clipboard"
                      >
                        {copiedStates['utc'] ? (
                          <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none rounded-none border">
                  <CardHeader className="py-2 px-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('labels.isoFormat')}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2">
                      <p className={jetbrainsMono.className}>{isoTime}</p>
                      <button
                        onClick={() => copyToClipboard(isoTime, 'iso')}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors group"
                        title="Copy to clipboard"
                      >
                        {copiedStates['iso'] ? (
                          <Check className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100 transition-colors" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* World Clock Tab */}
          <div
            className={`${activeTab === "world-clock" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "world-clock"}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('sections.worldClock')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showAddTimezone && (
                  <Card className="col-span-full">
                    <CardContent className="pt-4">
                      <div className="flex flex-col gap-4">
                        <Label>{t('labels.selectTimezone')}</Label>
                        <Select
                          onValueChange={(value) => {
                            const tz = availableTimezones.find(t => t.value === value)
                            if (tz && !customTimezones.some(ct => ct.value === tz.value)) {
                              setCustomTimezones(prev => [...prev, tz])
                              setShowAddTimezone(false)
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimezones
                              .filter(tz => !customTimezones.some(ct => ct.value === tz.value))
                              .map((tz) => {
                                const s = spacetime(currentTime, tz.value)
                                const offset = s.timezone().current.offset
                                return (
                                  <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label} (GMT{offset >= 0 ? `+${offset}` : offset})
                                  </SelectItem>
                                )
                              })}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddTimezone(false)}
                          className="w-full"
                        >
                          {t('labels.cancel')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {customTimezones.map((tz) => {
                  const s = spacetime(currentTime, tz.value)
                  const offset = s.timezone().current.offset
                  return (
                    <Card key={tz.value} className="group relative">
                      <button
                        onClick={() => setCustomTimezones(prev => prev.filter(t => t.value !== tz.value))}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove timezone"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{tz.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-3xl font-bold ${jetbrainsMono.className}`}>
                          {s.time()}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          GMT{offset >= 0 ? `+${offset}` : offset}
                        </p>
                        {s.isDST() && <DSTTag text={t('labels.dst')} />}
                      </div>
                      </CardContent>
                    </Card>
                  )
                })}
                {/* Add timezone button */}
                <Card 
                  className="group relative flex items-center justify-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" 
                  onClick={() => setShowAddTimezone(true)}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('labels.addTimezone')}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Calendar Tab */}
          <div
            className={`${activeTab === "calendar" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "calendar"}
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('sections.calendar')}</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                  </div>

                  {selectedDate && (
                    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <h3 className="font-medium mb-2">Selected Date Information</h3>
                      <p>
                        <span className="font-medium">Day of Week:</span>{" "}
                        {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                      </p>
                      <p>
                        <span className="font-medium">Day of Year:</span>{" "}
                        {Math.floor(
                          (selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 0).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Week Number:</span>{" "}
                        {Math.ceil(
                          ((selectedDate.getTime() - new Date(selectedDate.getFullYear(), 0, 0).getTime()) / 86400000 +
                            1) /
                            7,
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Converter Tab */}
          <div
            className={`${activeTab === "converter" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "converter"}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('sections.timeZoneConverter')}</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="from-timezone">{t('labels.fromTimezone')}</Label>
                      <Select value={fromTimezone} onValueChange={setFromTimezone}>
                        <SelectTrigger id="from-timezone" className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          {availableTimezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label} (GMT{tz.offset >= 0 ? `+${tz.offset}` : tz.offset})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="to-timezone">{t('labels.toTimezone')}</Label>
                      <Select value={toTimezone} onValueChange={setToTimezone}>
                        <SelectTrigger id="to-timezone" className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          {availableTimezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label} (GMT{tz.offset >= 0 ? `+${tz.offset}` : tz.offset})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="convert-date">{t('labels.date')}</Label>
                      <Input
                        id="convert-date"
                        type="date"
                        value={convertDate}
                        onChange={(e) => setConvertDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="convert-time">{t('labels.time')}</Label>
                      <Input
                        id="convert-time"
                        type="time"
                        value={convertTime}
                        onChange={(e) => setConvertTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-6" onClick={handleConvertTime}>
                    {t('labels.convert')}
                  </Button>

                  {convertedTime && (
                    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <h3 className="font-medium mb-2">{t('labels.convertedTime')}</h3>
                      <p className={`text-xl ${jetbrainsMono.className}`}>{convertedTime}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Timer Tab */}
          <div
            className={`${activeTab === "timer" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "timer"}
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('sections.countdownTimer')}</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="hours">{t('labels.hours')}</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="23"
                        value={countdownHours}
                        onChange={(e) => setCountdownHours(e.target.value)}
                        disabled={countdownRunning}
                      />
                    </div>

                    <div>
                      <Label htmlFor="minutes">{t('labels.minutes')}</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={countdownMinutes}
                        onChange={(e) => setCountdownMinutes(e.target.value)}
                        disabled={countdownRunning}
                      />
                    </div>

                    <div>
                      <Label htmlFor="seconds">{t('labels.seconds')}</Label>
                      <Input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={countdownSeconds}
                        onChange={(e) => setCountdownSeconds(e.target.value)}
                        disabled={countdownRunning}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    {!countdownRunning ? (
                      <Button className="flex-1" onClick={startCountdown}>
                        {t('labels.start')}
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="destructive" onClick={() => setCountdownRunning(false)}>
                        {t('labels.pause')}
                      </Button>
                    )}

                    <Button className="flex-1" variant="outline" onClick={resetCountdown}>
                      {t('labels.reset')}
                    </Button>
                  </div>

                  {countdownTimeLeft && (
                    <div className="mt-6 text-center">
                      <h3 className="font-medium mb-2">{t('labels.timeRemaining')}</h3>
                      <p className={`text-4xl font-bold ${jetbrainsMono.className}`}>{countdownTimeLeft}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sun Times Tab */}
          <div
            className={`${activeTab === "sun" ? "block" : "hidden"}`}
            role="tabpanel"
            aria-hidden={activeTab !== "sun"}
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">{t('sections.sunriseSunset')}</h2>
              <Card>
                <CardContent className="pt-6">
                  {/* Removed location input field */}
                  <Button className="w-full" onClick={handleGetSunTimes} disabled={isFetchingSunTimes}>
                    {isFetchingSunTimes ? t('labels.loading') : t('labels.getSunTimes')}
                  </Button>

                  {sunriseSunset.sunrise && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md text-center">
                        <div className="flex justify-center mb-2">
                          <Sun className="h-6 w-6 text-yellow-500" />
                        </div>
                        <h3 className="font-medium mb-1">{t('labels.sunrise')}</h3>
                        <p className={`text-xl ${jetbrainsMono.className}`}>{sunriseSunset.sunrise}</p>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md text-center">
                        <div className="flex justify-center mb-2">
                          <Moon className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="font-medium mb-1">{t('labels.sunset')}</h3>
                        <p className={`text-xl ${jetbrainsMono.className}`}>{sunriseSunset.sunset}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('tools.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <a href="/year-progress-bar" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('tools.yearProgress')}
            </a>
            <a href="/age-calculator" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Calculator className="h-5 w-5" />
              {t('tools.ageCalculator')}
            </a>
            <a href="/utc" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Globe className="h-5 w-5" />
              {t('tools.utcTime')}
            </a>
            <a href="/holidays" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              {t('tools.worldHolidays')}
            </a>
          </div>
        </div>

        {/* City Links Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('cityTimes.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <a href="/cities/new-york" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              New York
            </a>
            <a href="/cities/london" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              London
            </a>
            <a href="/cities/tokyo" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              Tokyo
            </a>
            <a href="/cities/paris" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              Paris
            </a>
            <a href="/cities/sydney" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              Sydney
            </a>
            <a href="/cities/beijing" className="text-primary font-medium py-2 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center">
              Beijing
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 max-w-3xl mx-auto text-left">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('faq.title')}</h2>
          <Accordion 
            type="multiple" 
            collapsible 
            value={accordionValues}
            onValueChange={setAccordionValues}
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>{t('faq.utcGmt.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.utcGmt.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>{t('faq.timezones.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.timezones.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>{t('faq.unixTimestamp.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.unixTimestamp.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>{t('faq.clockAccuracy.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.clockAccuracy.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>{t('faq.iso8601.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.iso8601.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>{t('faq.daylightSaving.question')}</AccordionTrigger>
              <AccordionContent>
                <p>
                  {t('faq.daylightSaving.answer')}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>{t('faq.timezoneConversion.question')}</AccordionTrigger>
              <AccordionContent>
                <p>{t('faq.timezoneConversion.answer')}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <FullscreenTime
        time={formattedTime}
        isFullscreen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </main>
  )
}
