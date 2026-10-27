import { CITY_SEARCH } from './city-search-data'

export interface TimezoneSearchOption {
  /** Unique key: city slug, or the IANA id for zones without a listed city */
  key: string
  /** IANA zone id */
  tz: string
  label: string
  /** Lower-cased text the picker matches against: country, zone id, abbreviations, airport codes */
  keywords: string
}

/** Short zone names in both US and UK flavours, winter + summer (PST/PDT, CET/CEST, EET...), skipping "GMT+1" style ones. */
function abbreviations(tz: string, year: number): string[] {
  const out = new Set<string>()
  for (const locale of ['en-US', 'en-GB']) {
    for (const month of [0, 6]) {
      try {
        const parts = new Intl.DateTimeFormat(locale, { timeZone: tz, timeZoneName: 'short' }).formatToParts(new Date(Date.UTC(year, month, 1)))
        const name = parts.find((p) => p.type === 'timeZoneName')?.value
        if (name && !/^(GMT|UTC)[+-−]/.test(name)) out.add(name)
      } catch {}
    }
  }
  try {
    const long = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'long' }).formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value
    if (long) out.add(long)
  } catch {}
  return [...out]
}

let cache: TimezoneSearchOption[] | null = null

/** Every listed city plus every other IANA zone, searchable by city, country, zone id, abbreviation or airport code. */
export function getTimezoneSearchOptions(): TimezoneSearchOption[] {
  if (cache) return cache
  const year = new Date().getFullYear()
  const covered = new Set<string>()
  const list: TimezoneSearchOption[] = CITY_SEARCH.map(([key, name, tz, country, airports]) => {
    covered.add(tz)
    return {
      key,
      tz,
      label: name,
      keywords: [name, country, tz, tz.replace(/_/g, ' '), ...abbreviations(tz, year), airports].join(' ').toLowerCase(),
    }
  })
  let zones: string[] = []
  try {
    zones = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.('timeZone') ?? []
  } catch {}
  for (const tz of zones) {
    if (covered.has(tz) || tz.startsWith('Etc/') || !tz.includes('/')) continue
    const label = tz.split('/').pop()!.replace(/_/g, ' ')
    list.push({ key: tz, tz, label, keywords: [label, tz, tz.replace(/_/g, ' '), ...abbreviations(tz, year)].join(' ').toLowerCase() })
  }
  cache = list
  return list
}
