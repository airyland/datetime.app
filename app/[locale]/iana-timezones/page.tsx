"use client"

import { useState, useMemo, useEffect } from "react"
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getLocalePath } from '@/lib/locale-utils'
import { PageIntro, Section, SectionHeading, StatGrid, Stat, CardList, cardClass, inputClass, monoLabel, h2Class } from "@/components/ds"
import {
  ianaTimezones,
  searchTimezones,
  getPopularTimezones,
  sortTimezonesByOffset,
  getCurrentTimeForTimezone,
  regions,
  type IANATimezone,
  type TimezoneRegion,
} from '@/lib/iana-timezones'

// Usage: <TzTable zones={[...]} locale="en" labels={...} />
const GRID = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-1 px-[22px] py-3.5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.5fr)_76px_92px_128px]"

function TzTable({
  zones,
  locale,
  labels,
  timeOf,
}: {
  zones: IANATimezone[]
  locale: string
  labels: { timezone: string; country: string; abbr: string; offset: string; time: string }
  timeOf: (id: string) => string
}) {
  return (
    <CardList>
      <div className={cn(GRID, monoLabel, "hidden bg-paper py-3 md:grid")} aria-hidden="true">
        <span>{labels.timezone}</span>
        <span>{labels.country}</span>
        <span>{labels.abbr}</span>
        <span>{labels.offset}</span>
        <span>{labels.time}</span>
      </div>
      {zones.map((tz) => (
        <Link
          key={tz.id}
          href={getLocalePath(`/iana-timezones/${encodeURIComponent(tz.id)}`, locale)}
          title={`${tz.name} (${tz.id})`}
          className={cn(GRID, "group border-t border-line transition-colors hover:bg-paper")}
        >
          <span className="min-w-0">
            <span className="block truncate text-base font-medium tracking-[-0.01em]">{tz.name}</span>
            <span className="block truncate font-mono text-xs text-subtle">{tz.id}</span>
          </span>
          <span className="hidden truncate text-sm text-subtle md:block">{tz.city}, {tz.country}</span>
          <span className="hidden font-mono text-[13px] text-subtle md:block">{tz.abbreviation}</span>
          <span className="tnum text-right font-mono text-[13px] md:text-left">
            {tz.utcOffset}
            {tz.dstOffset && <span className="hidden text-subtle md:inline"> / {tz.dstOffset}</span>}
          </span>
          <span className="tnum col-start-2 row-start-2 text-right font-mono text-[13px] text-subtle md:col-start-auto md:row-start-auto md:text-left md:text-ink" suppressHydrationWarning>
            {timeOf(tz.id)}
          </span>
        </Link>
      ))}
    </CardList>
  )
}

const selectWrap = "relative min-w-0 flex-[1_1_200px]"
const selectClass = cn(inputClass, "appearance-none rounded-full pr-10")

export default function IANATimezonesPage() {
  const t = useTranslations('ianaTimezones')
  const tDetail = useTranslations('timezoneDetail')
  const locale = useLocale()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<TimezoneRegion | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'offset' | 'population'>('name')
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'regions'>('all')
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const filteredTimezones = useMemo(() => {
    let timezones = [...ianaTimezones]
    if (searchQuery) timezones = [...searchTimezones(searchQuery)]
    if (selectedRegion !== 'all') timezones = timezones.filter((tz) => tz.region === selectedRegion)
    switch (sortBy) {
      case 'offset':
        timezones = sortTimezonesByOffset(timezones)
        break
      case 'population':
        timezones = timezones
          .filter((tz) => tz.population)
          .sort((a, b) => (b.population || 0) - (a.population || 0))
          .concat(timezones.filter((tz) => !tz.population))
        break
      default:
        timezones = timezones.sort((a, b) => a.name.localeCompare(b.name))
    }
    return timezones
  }, [searchQuery, selectedRegion, sortBy])

  const popularTimezones = getPopularTimezones(12)
  const groupedByRegion = regions
    .map((region) => ({ region, timezones: ianaTimezones.filter((tz) => tz.region === region) }))
    .filter((g) => g.timezones.length > 0)

  const timeOf = (id: string) => getCurrentTimeForTimezone(id).time
  const labels = {
    timezone: t('timezones'),
    country: tDetail('basicInfo.country'),
    abbr: tDetail('timeInfo.abbreviation'),
    offset: tDetail('timeInfo.utcOffset'),
    time: tDetail('currentTime'),
  }

  const tabs = [
    { key: 'all', label: t('tabs.all') },
    { key: 'popular', label: t('tabs.popular') },
    { key: 'regions', label: t('tabs.byRegion') },
  ] as const

  const filtering = !!searchQuery || selectedRegion !== 'all'

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Home", href: getLocalePath("/", locale) }, { label: "Timezones" }]}
        eyebrow="IANA timezone database"
        title={t('title')}
        description={t('description')}
      />

      <Section top="clamp(8px,2vw,24px)">
        <StatGrid min={180}>
          <Stat label={t('stats.totalTimezones')} value={ianaTimezones.length} big />
          <Stat label={t('stats.regions')} value={regions.length} big />
          <Stat label={t('stats.countries')} value={new Set(ianaTimezones.map((tz) => tz.country)).size} big />
          <Stat label={t('stats.utcOffsets')} value={new Set(ianaTimezones.map((tz) => tz.utcOffset)).size} big />
        </StatGrid>
      </Section>

      <Section>
        <SectionHeading title={t('popularTimezones.title')} description={t('popularTimezones.description')} />
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))" }}>
          {popularTimezones.map((tz) => (
            <Link
              key={tz.id}
              href={getLocalePath(`/iana-timezones/${encodeURIComponent(tz.id)}`, locale)}
              title={`${tz.name} (${tz.id})`}
              className={cn(cardClass, "group flex min-w-0 items-center justify-between gap-3 px-5 py-4 transition-colors hover:border-ink")}
            >
              <span className="min-w-0 truncate text-base font-medium tracking-[-0.01em]">{tz.city}</span>
              <span className="tnum shrink-0 font-mono text-[13px] text-subtle">{tz.utcOffset}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          title={t('tabs.all')}
          description={filtering ? t('searchResults', { count: filteredTimezones.length }) : undefined}
        />
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-3">
          <div className="relative min-w-0 flex-[2_1_280px]">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-3.5 size-4 text-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className={cn(inputClass, "rounded-full pl-11 pr-4")}
            />
          </div>
          <div className={selectWrap}>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as TimezoneRegion | 'all')}
              aria-label={t('filterByRegion')}
              className={selectClass}
            >
              <option value="all">{t('allRegions')}</option>
              {regions.map((region) => (
                <option key={region} value={region}>{t(`regions.${region.toLowerCase()}`)}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-4 size-3.5 text-subtle" />
          </div>
          <div className={selectWrap}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'offset' | 'population')}
              aria-label={t('sortBy')}
              className={selectClass}
            >
              <option value="name">{t('sortBy')}: {t('sortOptions.name')}</option>
              <option value="offset">{t('sortBy')}: {t('sortOptions.offset')}</option>
              <option value="population">{t('sortBy')}: {t('sortOptions.population')}</option>
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-4 size-3.5 text-subtle" />
          </div>
        </div>

        <div role="tablist" aria-label="View" className="mt-3.5 inline-flex max-w-full flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", activeTab === tab.key ? "bg-ink text-paper" : "text-subtle hover:text-ink")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {/* All timezones */}
          <div hidden={activeTab !== 'all'}>
            <TzTable zones={filteredTimezones} locale={locale} labels={labels} timeOf={timeOf} />
            {filteredTimezones.length === 0 && (
              <div className="py-14 text-center text-subtle">
                <h3 className="m-0 mb-1.5 text-[17px] font-normal text-ink">{t('noResults.title')}</h3>
                {t('noResults.description')}
              </div>
            )}
          </div>

          {/* Popular timezones */}
          <div hidden={activeTab !== 'popular'}>
            <TzTable zones={popularTimezones} locale={locale} labels={labels} timeOf={timeOf} />
          </div>

          {/* By region */}
          <div hidden={activeTab !== 'regions'} className="space-y-10">
            {groupedByRegion.map(({ region, timezones }) => (
              <div key={region}>
                <div className="mb-3.5 flex items-baseline gap-3">
                  <h3 className="m-0 text-xl font-semibold tracking-[-0.02em]">{t(`regions.${region.toLowerCase()}`)}</h3>
                  <span className={cn(monoLabel, "tnum")}>{timezones.length} {t('timezones')}</span>
                </div>
                <TzTable zones={timezones} locale={locale} labels={labels} timeOf={timeOf} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-[clamp(56px,8vw,96px)]">
        <div className={cn(cardClass, "flex flex-wrap gap-x-16 gap-y-8 p-[clamp(24px,3.4vw,44px)]")}>
          <div className="min-w-0 flex-[3_1_460px]">
            <h2 className={h2Class}>{t('seo.about.title')}</h2>
            <p className="m-0 mt-4 max-w-[68ch] text-[15.5px] leading-[1.75] text-subtle">{t('seo.about.content')}</p>
            <h3 className="m-0 mt-8 text-lg font-semibold tracking-[-0.02em]">{t('seo.usage.title')}</h3>
            <p className="m-0 mt-3 max-w-[68ch] text-[15.5px] leading-[1.75] text-subtle">{t('seo.usage.content')}</p>
          </div>
          <div className="min-w-0 flex-[2_1_320px]">
            <h3 className="m-0 text-lg font-semibold tracking-[-0.02em]">{t('seo.features.title')}</h3>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0 text-[14.5px] leading-snug">
              {(t.raw('seo.features.list') as string[]).map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.25} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  )
}
