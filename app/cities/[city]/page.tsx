"use client"

import { useEffect, useState, use } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Globe, Clock, AlertCircle, Copy, Check, Maximize2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { JetBrains_Mono } from "next/font/google"
import { ThemeToggle } from "@/components/theme-toggle"
import { citiesData } from './metadata'
import { FullscreenTime } from '@/components/fullscreen-time'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface CityPageProps {
  params: { city: string };
}

export default function CityPage({ params }: CityPageProps) {
  const resolvedParams = use(params)
  const city = resolvedParams.city;
  const cityInfo = citiesData[city as keyof typeof citiesData];
  const [currentTime, setCurrentTime] = useState(new Date())
  const [accuracy, setAccuracy] = useState({ offset: 0, latency: 0 })
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  if (!cityInfo) {
    notFound();
  }

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

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    timeZone: cityInfo.timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // Format date
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    timeZone: cityInfo.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Unix timestamp
  const timestamp = Math.floor(currentTime.getTime() / 1000)

  // UTC time
  const utcTime = currentTime.toUTCString()

  // ISO format
  const isoTime = currentTime.toISOString()

  // Calculate GMT offset
  const now = new Date();
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const targetDate = new Date(now.toLocaleString('en-US', { timeZone: cityInfo.timezone }));
  const offsetInHours = (targetDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  
  let offsetString;
  const hours = Math.floor(Math.abs(offsetInHours));
  const minutes = Math.floor((Math.abs(offsetInHours) * 60) % 60);
  const sign = offsetInHours >= 0 ? '+' : '-';

  if (minutes === 0) {
    offsetString = `GMT${sign}${hours}`;
  } else {
    offsetString = `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  // City-specific FAQs
  const cityFaqs = [
    {
      question: `What time is it in ${cityInfo.name} now?`,
      answer: `The current local time in ${cityInfo.name}, ${cityInfo.country} is ${currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}. ${cityInfo.name} is in the ${cityInfo.timezone} timezone.`
    },
    {
      question: `What is the time difference between ${cityInfo.name} and UTC?`,
      answer: `${cityInfo.name} follows ${cityInfo.timezone} time. The current offset from UTC is ${currentTime.getTimezoneOffset() / -60} hours.`
    },
    {
      question: `Does ${cityInfo.name} observe Daylight Saving Time (DST)?`,
      answer: `This depends on the local regulations in ${cityInfo.country}. The time is currently ${currentTime.toLocaleTimeString('en-US', { timeZoneName: 'long' })} and automatically adjusts for DST when applicable.`
    },
  ]

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
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Datetime.app
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline">Toggle theme:</span>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 flex-grow">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Current Time in {cityInfo.name}, {cityInfo.country}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-muted-foreground">
              {cityInfo.timezone} Time Zone
            </h2>
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
                <p className={jetbrainsMono.className}>{cityInfo.timezone} ({offsetString})</p>
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
                <CardTitle className="text-lg">UTC Time</CardTitle>
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

        {/* City Information and FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="shadow-none rounded-none border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                City Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p>{cityInfo.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timezone</p>
                <p>{cityInfo.timezone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coordinates</p>
                <p>{cityInfo.coordinates}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Population</p>
                <p>{cityInfo.population}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none rounded-none border">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {cityFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      {isFullscreen && (
        <FullscreenTime 
          time={formattedTime}
          isFullscreen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </main>
  );
}
