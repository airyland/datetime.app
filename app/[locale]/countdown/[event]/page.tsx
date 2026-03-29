"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { JetBrains_Mono } from "next/font/google"
import { Card, CardContent } from "@/components/ui/card"
import HeaderClient from "../../year-progress-bar/header-client"
import { countdownEvents, getEventBySlug } from "@/lib/countdown-events"
import { getLocalePath } from "@/lib/locale-utils"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast: false }
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function formatTargetDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface CountdownUnitProps {
  value: number
  label: string
  mono: string
}

function CountdownUnit({ value, label, mono }: CountdownUnitProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-1">
        <span
          className={`${mono} text-5xl md:text-6xl font-bold tabular-nums leading-none`}
          aria-label={`${value} ${label}`}
        >
          {pad(value)}
        </span>
        <span className="text-sm text-muted-foreground uppercase tracking-widest mt-2">
          {label}
        </span>
      </CardContent>
    </Card>
  )
}

interface EventPageProps {
  params: Promise<{ event: string; locale: string }>
}

export default function EventCountdownPage({ params }: EventPageProps) {
  const resolvedParams = use(params)
  const { event: eventSlug } = resolvedParams

  const t = useTranslations("countdown")
  const locale = useLocale()

  const event = getEventBySlug(eventSlug)

  if (!event) {
    notFound()
  }

  const targetDate = event.getNextDate()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(event.getNextDate()))
    }, 1000)
    return () => clearInterval(timer)
  }, [event])

  const otherEvents = countdownEvents.filter((e) => e.slug !== event.slug)
  const eventName = t(`events.${eventSlug}.name`)

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="text-6xl md:text-7xl mb-4" role="img" aria-label={eventName}>
                {event.emoji}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t("countdownTo", { event: eventName })}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t(`events.${eventSlug}.description`)}
              </p>
            </div>

            {/* Countdown grid */}
            {timeLeft.isPast ? (
              <Card className="mb-8">
                <CardContent className="p-8 text-center">
                  <p className="text-2xl font-semibold">
                    {t("eventIsHere", { event: eventName, emoji: event.emoji })}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                aria-label={t("countdownTo", { event: eventName })}
                role="timer"
              >
                <CountdownUnit value={timeLeft.days} label={t("days")} mono={jetbrainsMono.className} />
                <CountdownUnit value={timeLeft.hours} label={t("hours")} mono={jetbrainsMono.className} />
                <CountdownUnit value={timeLeft.minutes} label={t("minutes")} mono={jetbrainsMono.className} />
                <CountdownUnit value={timeLeft.seconds} label={t("seconds")} mono={jetbrainsMono.className} />
              </div>
            )}

            {/* Target date */}
            <p className="text-center text-muted-foreground mb-12">
              {formatTargetDate(targetDate, locale)}
            </p>

            {/* Other countdowns */}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4 text-center">{t("otherCountdowns")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {otherEvents.map((other) => {
                  const otherName = t(`events.${other.slug}.name`)
                  return (
                    <Link
                      key={other.slug}
                      href={getLocalePath(`/countdown/${other.slug}`, locale)}
                      className="group"
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-primary/40 group-hover:bg-secondary/30">
                        <CardContent className="p-3 flex flex-col items-center gap-1 text-center">
                          <span className="text-2xl" role="img" aria-label={otherName}>
                            {other.emoji}
                          </span>
                          <span className="text-xs font-medium leading-tight">{otherName}</span>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Back link */}
            <div className="text-center mt-8">
              <Link
                href={getLocalePath("/countdown", locale)}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://datetime.app" },
          { name: t("pageTitle"), url: "https://datetime.app/countdown" },
          {
            name: t("countdownTo", { event: eventName }),
            url: `https://datetime.app/countdown/${event.slug}`,
          },
        ]}
      />
    </main>
  )
}
