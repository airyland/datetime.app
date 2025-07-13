"use client"

import { useState, useMemo } from "react"
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Globe, Clock, Users, MapPin, Filter } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { JetBrains_Mono } from "next/font/google"
import { 
  ianaTimezones, 
  getTimezonesByRegion, 
  searchTimezones, 
  getPopularTimezones,
  sortTimezonesByOffset,
  getCurrentTimeForTimezone,
  regions,
  type TimezoneRegion 
} from '@/lib/iana-timezones'

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

export default function IANATimezonesPage() {
  const t = useTranslations('ianaTimezones')
  const tCommon = useTranslations('common')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<TimezoneRegion | 'all'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'offset' | 'population'>('name')
  const [activeTab, setActiveTab] = useState('all')

  // Get filtered and sorted timezones
  const filteredTimezones = useMemo(() => {
    let timezones = ianaTimezones;

    // Filter by search query
    if (searchQuery) {
      timezones = searchTimezones(searchQuery);
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      timezones = timezones.filter(tz => tz.region === selectedRegion);
    }

    // Sort timezones
    switch (sortBy) {
      case 'offset':
        timezones = sortTimezonesByOffset(timezones);
        break;
      case 'population':
        timezones = timezones
          .filter(tz => tz.population)
          .sort((a, b) => (b.population || 0) - (a.population || 0))
          .concat(timezones.filter(tz => !tz.population));
        break;
      default:
        timezones = timezones.sort((a, b) => a.name.localeCompare(b.name));
    }

    return timezones;
  }, [searchQuery, selectedRegion, sortBy]);

  const popularTimezones = getPopularTimezones(12);
  const groupedByRegion = regions.map(region => ({
    region,
    timezones: getTimezonesByRegion(region)
  })).filter(group => group.timezones.length > 0);

  const TimezoneCard = ({ timezone }: { timezone: typeof ianaTimezones[0] }) => {
    const currentTime = getCurrentTimeForTimezone(timezone.id);
    
    return (
      <Link 
        href={`/iana-timezones/${encodeURIComponent(timezone.id)}`}
        className="block h-full"
      >
        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base leading-tight mb-1 line-clamp-2">
                  {timezone.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-mono">
                  {timezone.id}
                </p>
              </div>
              <Badge variant="outline" className="ml-2 shrink-0">
                {timezone.abbreviation}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Current Time */}
            <div className="bg-primary/5 rounded-lg p-3">
              <div className={`text-lg font-bold ${jetbrainsMono.className}`}>
                {currentTime.time}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentTime.date}
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="line-clamp-1">{timezone.city}, {timezone.country}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-muted-foreground shrink-0" />
                <span>{timezone.utcOffset}</span>
                {timezone.dstOffset && (
                  <span className="text-muted-foreground">
                    / {timezone.dstOffset} (DST)
                  </span>
                )}
              </div>

              {timezone.population && (
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span>{(timezone.population / 1000000).toFixed(1)}M people</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" title={tCommon('links.titleHome')}>
          Datetime.app
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">{t('toggleTheme')}:</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('description')}
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                {ianaTimezones.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.totalTimezones')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                {regions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.regions')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                {new Set(ianaTimezones.map(tz => tz.country)).size}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.countries')}
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>
                {new Set(ianaTimezones.map(tz => tz.utcOffset)).size}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('stats.utcOffsets')}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as TimezoneRegion | 'all')}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <SelectValue placeholder={t('filterByRegion')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allRegions')}</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          {t(`regions.${region.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'offset' | 'population')}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{t('sortOptions.name')}</SelectItem>
                      <SelectItem value="offset">{t('sortOptions.offset')}</SelectItem>
                      <SelectItem value="population">{t('sortOptions.population')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count */}
              {(searchQuery || selectedRegion !== 'all') && (
                <div className="text-sm text-muted-foreground">
                  {t('searchResults', { count: filteredTimezones.length })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t('tabs.all')}
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t('tabs.popular')}
            </TabsTrigger>
            <TabsTrigger value="regions" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('tabs.byRegion')}
            </TabsTrigger>
          </TabsList>

          {/* All Timezones */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTimezones.map((timezone) => (
                <TimezoneCard key={timezone.id} timezone={timezone} />
              ))}
            </div>
            
            {filteredTimezones.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('noResults.title')}</h3>
                <p className="text-muted-foreground">{t('noResults.description')}</p>
              </div>
            )}
          </TabsContent>

          {/* Popular Timezones */}
          <TabsContent value="popular" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{t('popularTimezones.title')}</h2>
              <p className="text-muted-foreground">{t('popularTimezones.description')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {popularTimezones.map((timezone) => (
                <TimezoneCard key={timezone.id} timezone={timezone} />
              ))}
            </div>
          </TabsContent>

          {/* By Region */}
          <TabsContent value="regions" className="space-y-8">
            {groupedByRegion.map(({ region, timezones }) => (
              <div key={region} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">
                    {t(`regions.${region.toLowerCase()}`)} 
                  </h2>
                  <Badge variant="secondary">
                    {timezones.length} {t('timezones')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {timezones.slice(0, 6).map((timezone) => (
                    <TimezoneCard key={timezone.id} timezone={timezone} />
                  ))}
                </div>

                {timezones.length > 6 && (
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setSelectedRegion(region);
                        setActiveTab('all');
                      }}
                      className="text-primary hover:underline"
                    >
                      {t('viewAll', { count: timezones.length - 6 })}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* SEO Content */}
        <div className="mt-16 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('seo.about.title')}</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{t('seo.about.content')}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('seo.features.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {t.raw('seo.features.list').map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('seo.usage.title')}</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-sm">
                <p>{t('seo.usage.content')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}