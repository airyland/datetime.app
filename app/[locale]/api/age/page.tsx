import Link from "next/link"
import { getTranslations } from 'next-intl/server'

import HeaderClient from "../../year-progress-bar/header-client"
import AgeApiTesterClient from "./api-tester-client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Code, FileJson, Network } from "lucide-react"
import { getLocalePath } from '@/lib/locale-utils'

export default async function AgeApiDocumentationPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const t = await getTranslations({ locale, namespace: 'apiAge' })
  const apiBasePath = getLocalePath('/api', locale)

  const parameters = [
    {
      name: 'birthdate',
      type: 'string',
      required: t('parameters.required'),
      description: t('parameters.birthdate'),
    },
    {
      name: 'targetDate',
      type: 'string',
      required: t('parameters.optional'),
      description: t('parameters.targetDate'),
    },
    {
      name: 'utcOffset',
      type: t('parameters.utcOffsetType'),
      required: t('parameters.optional'),
      description: t('parameters.utcOffset'),
    },
  ]

  const sampleResponse = JSON.stringify({
    birthdate: '1990-01-15',
    targetDate: '2024-10-17',
    utcOffset: {
      minutes: 0,
      label: '+00:00',
    },
    age: {
      years: 34,
      months: 9,
      days: 2,
      totalDays: 12705,
      totalMonths: 417,
      decimalAge: 34.8,
      formatted: {
        readable: '34 years and 9 months',
        full: '34 years, 9 months, 2 days, 0 hours, 0 minutes, 0 seconds',
        short: '34y 9m 2d',
        ymd: '34 years, 9 months, 2 days',
        decimal: '34.80 years',
      },
    },
  }, null, 2)

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <HeaderClient />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={getLocalePath('/', locale)}>{t('breadcrumbs.home')}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={apiBasePath}>{t('breadcrumbs.apiDirectory')}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('breadcrumbs.current')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <section className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Network className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
                  <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">GET</Badge>
                <code className="rounded bg-muted px-2 py-1 text-sm">/api/age</code>
              </div>
            </section>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" aria-hidden />
                  {t('endpoint.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t('endpoint.description')}</p>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">{t('parameters.title')}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('parameters.table.name')}</TableHead>
                        <TableHead>{t('parameters.table.type')}</TableHead>
                        <TableHead>{t('parameters.table.required')}</TableHead>
                        <TableHead>{t('parameters.table.description')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parameters.map((parameter) => (
                        <TableRow key={parameter.name}>
                          <TableCell className="font-mono text-sm">{parameter.name}</TableCell>
                          <TableCell className="text-sm">{parameter.type}</TableCell>
                          <TableCell className="text-sm">{parameter.required}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{parameter.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" aria-hidden />
                  {t('response.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t('response.description')}</p>
                <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm font-mono">
                  {sampleResponse}
                </pre>
              </CardContent>
            </Card>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">{t('tester.title')}</h2>
              <p className="text-muted-foreground">{t('tester.description')}</p>
              <AgeApiTesterClient locale={locale} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
