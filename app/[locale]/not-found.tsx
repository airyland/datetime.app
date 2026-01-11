import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocalePath } from "@/lib/locale-utils"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  const locale = await getLocale()

  const quickLinks = [
    { href: "/year-progress-bar", label: t("links.yearProgress") },
    { href: "/age-calculator", label: t("links.ageCalculator") },
    { href: "/utc", label: t("links.utc") },
    { href: "/holidays", label: t("links.holidays") },
    { href: "/unix-timestamp", label: t("links.unixTimestamp") },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("description")}</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t("quickLinksTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalePath(link.href, locale)}
                className="rounded-lg border p-3 hover:bg-secondary/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
