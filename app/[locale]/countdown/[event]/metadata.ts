import { Metadata } from "next"
import { getEventBySlug } from "@/lib/countdown-events"
import { getTranslations } from "next-intl/server"

interface MetadataProps {
  params: { event: string; locale: string }
}

export async function generateEventMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { event: eventSlug, locale } = await params
  const event = getEventBySlug(eventSlug)

  if (!event) {
    return {
      title: "Countdown Not Found | Datetime.app",
    }
  }

  const t = await getTranslations({ locale, namespace: "countdown" })
  const eventName = t(`events.${eventSlug}.name`)
  const targetDate = event.getNextDate()
  const year = targetDate.getFullYear()
  const title = `${t("countdownTo", { event: eventName })} ${year} | Datetime.app`
  const description = `${t(`events.${eventSlug}.description`)}. See exactly how many days, hours, minutes, and seconds remain until ${eventName} ${year}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  }
}
