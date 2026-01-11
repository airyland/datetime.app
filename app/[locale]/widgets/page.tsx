"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Code2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StructuredData from "@/components/structured-data"
import { getLocalePath } from "@/lib/locale-utils"

export default function WidgetsPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = useTranslations("widgets")

  const embedUrl = useMemo(() => `https://datetime.app${getLocalePath("/embed/clock", locale)}`, [locale])
  const embedCode = `<iframe src=\"${embedUrl}\" width=\"240\" height=\"80\" style=\"border:0;\" loading=\"lazy\"></iframe>`

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: `https://datetime.app${getLocalePath("/widgets", locale)}`,
    inLanguage: locale,
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <StructuredData data={webAppSchema} />
      <div className="container mx-auto px-4 py-10 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              {t("clockWidget")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("instructions")}</p>
            <pre className="rounded-lg bg-secondary/50 p-3 text-xs overflow-x-auto">
              {embedCode}
            </pre>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <a href={embedUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  {t("preview")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
