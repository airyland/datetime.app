import { Metadata } from 'next'
import { citiesData } from '@/app/[locale]/cities/[city]/metadata'

const getTimezoneOffset = (timezone: string): number => {
  const now = new Date()
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
}

function formatHourDiff(diff: number): string {
  const abs = Math.abs(diff)
  if (abs === 0) return 'no time difference'
  const hours = Math.floor(abs)
  const mins = Math.round((abs - hours) * 60)
  if (mins === 0) return `${hours} hour${hours === 1 ? '' : 's'} difference`
  return `${hours}h ${mins}m difference`
}

interface CitiesPageProps {
  params: { cities: string; locale: string }
}

export async function generateMetadata({
  params,
}: CitiesPageProps): Promise<Metadata> {
  const { cities } = params
  const parts = cities.split('-vs-')
  if (parts.length !== 2) return {}

  const [cityAKey, cityBKey] = parts
  const cityA = citiesData[cityAKey as keyof typeof citiesData]
  const cityB = citiesData[cityBKey as keyof typeof citiesData]

  if (!cityA || !cityB) return {}

  const offsetA = getTimezoneOffset(cityA.timezone)
  const offsetB = getTimezoneOffset(cityB.timezone)
  const diff = formatHourDiff(Math.abs(offsetA - offsetB))

  const title = `Time Difference: ${cityA.name} vs ${cityB.name} | Datetime.app`
  const description = `Current time difference between ${cityA.name} and ${cityB.name}. ${cityA.name} (${cityA.timezone}) and ${cityB.name} (${cityB.timezone}) have a ${diff}. Find the best meeting times and compare working hours.`

  return {
    title,
    description,
    keywords: [
      `${cityA.name} ${cityB.name} time difference`,
      `time difference ${cityA.name} ${cityB.name}`,
      `${cityA.name} vs ${cityB.name} time`,
      `${cityA.timezone} timezone`,
      `${cityB.timezone} timezone`,
      'world clock',
      'time zone converter',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}
