import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import HeaderClient from "../year-progress-bar/header-client"
import { countdownEvents } from "@/lib/countdown-events"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { getLocalePath } from "@/lib/locale-utils"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "countdown" })
  return {
    title: `${t("pageTitle")} | Datetime.app`,
    description: t("subtitle"),
  }
}

function getDaysLeft(date: Date): number {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatTargetDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface CountdownIndexPageProps {
  params: Promise<{ locale: string }>
}

export default async function CountdownIndexPage({ params }: CountdownIndexPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "countdown" })

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
              {t("pageTitle")}
            </h1>
            <p className="text-xl text-center text-muted-foreground mb-8">
              {t("subtitle")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {countdownEvents.map((event) => {
                const targetDate = event.getNextDate()
                const daysLeft = getDaysLeft(targetDate)
                const eventName = t(`events.${event.slug}.name`)

                return (
                  <Link
                    key={event.slug}
                    href={getLocalePath(`/countdown/${event.slug}`, locale)}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/40 group-hover:bg-secondary/30">
                      <CardContent className="p-5 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl" role="img" aria-label={eventName}>
                            {event.emoji}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base leading-tight">{eventName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {formatTargetDate(targetDate, locale)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t(`events.${event.slug}.description`)}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {daysLeft === 0
                            ? t("today")
                            : daysLeft === 1
                            ? t("dayLeft")
                            : t("daysLeft", { count: daysLeft.toLocaleString() })}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://datetime.app" },
          { name: t("pageTitle"), url: "https://datetime.app/countdown" },
        ]}
      />
    </main>
  )
}
