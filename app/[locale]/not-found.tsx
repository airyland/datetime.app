"use client"

import Link from "next/link"
import { Globe, Calculator, Calendar, PartyPopper, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HeaderClient from "./year-progress-bar/header-client"
import { useLocale, useTranslations } from "next-intl"
import { getLocalePath } from "@/lib/locale-utils"

export default function NotFound() {
  const locale = useLocale()
  const t = useTranslations("notFound")

  const tools = [
    {
      title: t("worldClock"),
      description: t("worldClockDesc"),
      path: "/",
      icon: Globe,
    },
    {
      title: t("ageCalculator"),
      description: t("ageCalculatorDesc"),
      path: "/age-calculator",
      icon: Calculator,
    },
    {
      title: t("calendar"),
      description: t("calendarDesc"),
      path: "/calendar/2026",
      icon: Calendar,
    },
    {
      title: t("holidays"),
      description: t("holidaysDesc"),
      path: "/holidays",
      icon: PartyPopper,
    },
    {
      title: t("yearProgress"),
      description: t("yearProgressDesc"),
      path: "/year-progress-bar",
      icon: TrendingUp,
    },
    {
      title: t("utcTime"),
      description: t("utcTimeDesc"),
      path: "/utc",
      icon: Clock,
    },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-8xl font-bold text-muted-foreground/30 select-none leading-none mb-4">
                404
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tools.map(({ title, description, path, icon: Icon }) => (
                <Link
                  key={path}
                  href={getLocalePath(path, locale)}
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                >
                  <Card className="h-full transition-shadow hover:shadow-md group-hover:border-foreground/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
