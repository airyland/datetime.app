"use client"

import { useEffect, useState } from "react"
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

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

// Popular timezones for the world clock
const popularTimezones = [
  { value: "America/New_York", label: "New York", offset: -5 },
  { value: "America/Los_Angeles", label: "Los Angeles", offset: -8 },
  { value: "Europe/London", label: "London", offset: 0 },
  { value: "Europe/Paris", label: "Paris", offset: 1 },
  { value: "Asia/Tokyo", label: "Tokyo", offset: 9 },
  { value: "Asia/Shanghai", label: "Shanghai", offset: 8 },
  { value: "Australia/Sydney", label: "Sydney", offset: 11 },
  { value: "Pacific/Auckland", label: "Auckland", offset: 13 },
]

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
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

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format date
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Timezone info
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const offset = -(currentTime.getTimezoneOffset() / 60)
  const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`
  const timezoneInfo = `${timezone} (GMT${offsetStr})`
  
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

  // Handle timezone conversion
  const handleConvertTime = () => {
    try {
      const dateTimeStr = `${convertDate}T${convertTime}:00`
      const dateInFromTimezone = new Date(dateTimeStr)

      // This is a simplified conversion. In a real app, you would use a library like date-fns-tz
      // or moment-timezone for accurate timezone conversions
      const convertedDateTime = new Date(dateInFromTimezone)

      setConvertedTime(
        convertedDateTime.toLocaleString("en-US", {
          timeZone: toTimezone,
          hour12: true,
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
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
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Datetime.app</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline">Toggle theme:</span>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 flex-grow">
        {/* SEO-friendly tabs that keep all content in the DOM */}
        <div className="w-full">
          {/* Tab navigation - improved for small screens */}
          <div className="flex justify-between md:justify-start md:space-x-4 mb-8 border-b overflow-x-auto no-scrollbar">
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
              <span className="hidden md:inline">Current Time</span>
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
              <span className="hidden md:inline">World Clock</span>
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
              <span className="hidden md:inline">Calendar</span>
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
              <span className="hidden md:inline">Converter</span>
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
              <span className="hidden md:inline">Timer</span>
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
              <span className="hidden md:inline">Sun Times</span>
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
                <h2 className="text-xl md:text-2xl font-medium mb-2">Current Time</h2>
                <div className="relative group">
                  <div
                    className={`text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none ${jetbrainsMono.className} cursor-pointer`}
                    onClick={() => setIsFullscreen(true)}
                  >
                    {formattedTime}
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
                      Clock is approximately {Math.round(accuracy.offset / 1000)} seconds off from server time
                    </span>
                  ) : (
                    <span>Clock is synchronized (±{Math.round(accuracy.offset)}ms)</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
                <Card className="shadow-none rounded-none border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Timezone Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={jetbrainsMono.className}>{timezoneInfo}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-none rounded-none border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Unix Timestamp</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-center">
                      <a href="/utc" className="inline-flex items-center gap-1 hover:underline justify-center">
                        UTC Time
                        <Globe className="h-3 w-3" />
                      </a>
                    </CardTitle>
                    <div className="text-xs text-center mt-1">
                      <a href="/glossary/utc" className="text-muted-foreground hover:underline">Learn about UTC</a>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ISO Format</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
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
              <h2 className="text-2xl font-bold mb-6 text-center">World Clock</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTimezones.map((tz) => (
                  <Card key={tz.value}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{tz.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-3xl font-bold ${jetbrainsMono.className}`}>
                        {new Date(currentTime.getTime() + (tz.offset - offset) * 3600000).toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        GMT{tz.offset >= 0 ? `+${tz.offset}` : tz.offset}
                      </p>
                    </CardContent>
                  </Card>
                ))}
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
              <h2 className="text-2xl font-bold mb-6 text-center">Calendar</h2>
              <Card>
                <CardContent className="pt-6">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto" />

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
              <h2 className="text-2xl font-bold mb-6 text-center">Time Zone Converter</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="from-timezone">From Time Zone</Label>
                      <Select value={fromTimezone} onValueChange={setFromTimezone}>
                        <SelectTrigger id="from-timezone" className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          {popularTimezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label} (GMT{tz.offset >= 0 ? `+${tz.offset}` : tz.offset})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="to-timezone">To Time Zone</Label>
                      <Select value={toTimezone} onValueChange={setToTimezone}>
                        <SelectTrigger id="to-timezone" className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          {popularTimezones.map((tz) => (
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
                      <Label htmlFor="convert-date">Date</Label>
                      <Input
                        id="convert-date"
                        type="date"
                        value={convertDate}
                        onChange={(e) => setConvertDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="convert-time">Time</Label>
                      <Input
                        id="convert-time"
                        type="time"
                        value={convertTime}
                        onChange={(e) => setConvertTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-6" onClick={handleConvertTime}>
                    Convert
                  </Button>

                  {convertedTime && (
                    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-800 rounded-md">
                      <h3 className="font-medium mb-2">Converted Time</h3>
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
              <h2 className="text-2xl font-bold mb-6 text-center">Countdown Timer</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="hours">Hours</Label>
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
                      <Label htmlFor="minutes">Minutes</Label>
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
                      <Label htmlFor="seconds">Seconds</Label>
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
                        Start
                      </Button>
                    ) : (
                      <Button className="flex-1" variant="destructive" onClick={() => setCountdownRunning(false)}>
                        Pause
                      </Button>
                    )}

                    <Button className="flex-1" variant="outline" onClick={resetCountdown}>
                      Reset
                    </Button>
                  </div>

                  {countdownTimeLeft && (
                    <div className="mt-6 text-center">
                      <h3 className="font-medium mb-2">Time Remaining</h3>
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
              <h2 className="text-2xl font-bold mb-6 text-center">Sunrise & Sunset</h2>
              <Card>
                <CardContent className="pt-6">
                  {/* Removed location input field */}
                  <Button className="w-full" onClick={handleGetSunTimes} disabled={isFetchingSunTimes}>
                    {isFetchingSunTimes ? "Loading..." : "Get Sun Times (Use My Location)"}
                  </Button>

                  {sunriseSunset.sunrise && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md text-center">
                        <div className="flex justify-center mb-2">
                          <Sun className="h-6 w-6 text-yellow-500" />
                        </div>
                        <h3 className="font-medium mb-1">Sunrise</h3>
                        <p className={`text-xl ${jetbrainsMono.className}`}>{sunriseSunset.sunrise}</p>
                      </div>

                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-md text-center">
                        <div className="flex justify-center mb-2">
                          <Moon className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="font-medium mb-1">Sunset</h3>
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
          <h2 className="text-2xl font-bold mb-6 text-center">Time Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <a href="/year-progress-bar" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              Year Progress Bar
            </a>
            <a href="/age-calculator" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Calculator className="h-5 w-5" />
              Age Calculator
            </a>
            <a href="/utc" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Globe className="h-5 w-5" />
              UTC Time
            </a>
            <a href="/holidays" className="text-primary font-medium py-3 px-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <Gift className="h-5 w-5" />
              World Holidays
            </a>
          </div>
        </div>

        {/* City Links Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">World City Times</h2>
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
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is UTC/GMT time?</AccordionTrigger>
              <AccordionContent>
                <p>
                  UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and
                  time. It is similar to GMT (Greenwich Mean Time) but is more precisely defined by atomic clocks. UTC
                  is the time standard used across the internet and for international communications and aviation.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do timezones work?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Timezones are regions of the globe that observe a uniform standard time. They are generally defined as
                  offsets from UTC, typically in whole-hour increments. For example, Eastern Standard Time (EST) is
                  UTC-5, meaning it is 5 hours behind UTC. Timezones were created to standardize time across large
                  geographical areas and are often influenced by political boundaries as well as geographical ones.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What is a Unix timestamp?</AccordionTrigger>
              <AccordionContent>
                <p>
                  A Unix timestamp (also known as Unix time or POSIX time) represents the number of seconds that have
                  elapsed since January 1, 1970, at 00:00:00 UTC, not counting leap seconds. It's widely used in
                  computer systems and programming as a standardized way to track time regardless of timezone. Unix
                  timestamps make it easy to calculate time differences and are independent of calendar conventions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How accurate is this clock?</AccordionTrigger>
              <AccordionContent>
                <p>
                  The accuracy of this clock depends on your device's system clock and internet connection. While we
                  strive to display the most accurate time possible, there may be slight variations due to network
                  latency or your device's clock synchronization. For most everyday purposes, the time displayed should
                  be accurate within a few seconds of the actual time. For applications requiring millisecond precision,
                  specialized time servers should be used.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What is ISO 8601 format?</AccordionTrigger>
              <AccordionContent>
                <p>
                  ISO 8601 is an international standard for representing dates and times. It follows the format
                  YYYY-MM-DDTHH:MM:SS.sssZ, where:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>YYYY-MM-DD represents the date (year, month, day)</li>
                  <li>T is a separator between date and time</li>
                  <li>HH:MM:SS.sss represents the time (hours, minutes, seconds, and milliseconds)</li>
                  <li>Z indicates that the time is in UTC (or an offset can be specified, like +01:00)</li>
                </ul>
                <p className="mt-2">
                  This format eliminates ambiguity in international communications and is widely used in computing.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What is Daylight Saving Time?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Daylight Saving Time (DST) is the practice of advancing clocks during warmer months so that darkness
                  falls later each day according to the clock. Typically, regions that observe DST adjust clocks forward
                  one hour in the spring ("spring forward") and adjust them backward in the autumn ("fall back"). The
                  main purpose is to make better use of daylight during the evening hours. Not all countries observe
                  DST, and the start and end dates vary by region.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>How do I convert between timezones?</AccordionTrigger>
              <AccordionContent>
                <p>To convert time between timezones, you need to:</p>
                <ol className="list-decimal pl-5 mt-2">
                  <li>Determine the UTC offset for both the source and target timezones</li>
                  <li>Convert the source time to UTC by adding or subtracting its offset</li>
                  <li>Convert from UTC to the target timezone by adding or subtracting the target timezone's offset</li>
                </ol>
                <p className="mt-2">
                  For example, to convert 3:00 PM in New York (UTC-5) to London time (UTC+0), you would add 5 hours to
                  get 8:00 PM London time. Remember to account for Daylight Saving Time if applicable, as it can change
                  the UTC offset temporarily.
                </p>
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
