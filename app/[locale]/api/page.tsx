import Link from "next/link"
import { getTranslations } from 'next-intl/server'

import HeaderClient from "../year-progress-bar/header-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLocalePath } from '@/lib/locale-utils'
import { ArrowRight, List } from "lucide-react"

export default async function ApiDirectoryPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'apiDirectory' })
  const ageApi = {
    slug: 'age',
    name: t('age.title'),
    description: t('age.description'),
    cta: t('age.cta'),
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <List className="h-6 w-6" aria-hidden />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
              <p className="text-lg text-muted-foreground">{t('description')}</p>
            </div>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center justify-between gap-4">
                  <span>{ageApi.name}</span>
                  <Button asChild>
                    <Link href={getLocalePath(`/api/${ageApi.slug}`, locale)} className="inline-flex items-center gap-2">
                      {ageApi.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </CardTitle>
                <CardDescription>{ageApi.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>{t('age.features.precision')}</li>
                  <li>{t('age.features.formats')}</li>
                  <li>{t('age.features.validation')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
