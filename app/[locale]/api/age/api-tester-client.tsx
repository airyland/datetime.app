"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Copy, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ApiResponseState {
  status: number
  body: unknown
  durationMs: number
}

export default function AgeApiTesterClient({ locale }: { locale: string }) {
  const t = useTranslations('apiAge.tester')
  const [birthdate, setBirthdate] = useState('2000-01-01')
  const [targetDate, setTargetDate] = useState('')
  const [utcOffset, setUtcOffset] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponseState | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setResponse(null)

    const params = new URLSearchParams({ birthdate })
    if (targetDate.trim()) {
      params.set('targetDate', targetDate.trim())
    }
    if (utcOffset.trim()) {
      params.set('utcOffset', utcOffset.trim())
    }

    const endpoint = `/api/age?${params.toString()}`
    const startTime = performance.now()

    try {
      const res = await fetch(endpoint, {
        headers: {
          'Accept-Language': locale,
        },
      })
      const durationMs = performance.now() - startTime
      const data = await res.json()
      setResponse({ status: res.status, body: data, durationMs })
    } catch (error) {
      const durationMs = performance.now() - startTime
      setResponse({
        status: 0,
        body: { error: (error as Error).message },
        durationMs,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ description: t('copied') })
    })
  }

  const formattedCurl = () => {
    const params = new URLSearchParams({ birthdate })
    if (targetDate.trim()) {
      params.set('targetDate', targetDate.trim())
    }
    if (utcOffset.trim()) {
      params.set('utcOffset', utcOffset.trim())
    }
    const query = params.toString()
    return `curl "https://datetime.app/api/age?${query}"`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthdate">{t('fields.birthdate')}</Label>
              <Input
                id="birthdate"
                value={birthdate}
                onChange={(event) => setBirthdate(event.target.value)}
                placeholder="1990-01-15"
                required
              />
              <p className="text-xs text-muted-foreground">{t('help.birthdate')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">{t('fields.targetDate')}</Label>
              <Input
                id="targetDate"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                placeholder="2025-10-17"
              />
              <p className="text-xs text-muted-foreground">{t('help.targetDate')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="utcOffset">{t('fields.utcOffset')}</Label>
              <Input
                id="utcOffset"
                value={utcOffset}
                onChange={(event) => setUtcOffset(event.target.value)}
                placeholder="-05:00"
              />
              <p className="text-xs text-muted-foreground">{t('help.utcOffset')}</p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="inline-flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {t('submit')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t('curlTitle')}</h3>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={() => handleCopy(formattedCurl())}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {t('copy')}
          </Button>
        </div>
        <Textarea value={formattedCurl()} readOnly rows={3} className="font-mono text-sm" />
        <Separator />
        {response ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={response.status >= 200 && response.status < 300 ? 'default' : 'destructive'}>
                  {response.status === 0 ? t('statusUnknown') : t('status', { code: response.status })}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t('duration', { ms: Math.round(response.durationMs) })}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => handleCopy(JSON.stringify(response.body, null, 2))}
                className="inline-flex items-center gap-2"
              >
                <Copy className="h-4 w-4" aria-hidden />
                {t('copyResponse')}
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-4 text-sm font-mono">
              {JSON.stringify(response.body, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('emptyState')}</p>
        )}
      </CardFooter>
    </Card>
  )
}
