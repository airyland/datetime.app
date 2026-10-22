"use client"

import { useState } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { cardClass, monoLabel, inputClass } from "@/components/ds"
import { SelectField } from "@/components/holiday-calendar"
import { getLocalePath } from "@/lib/locale-utils"
import { COUNTRIES, SUPPORTED_LANGUAGES, CountryInfo, LanguageInfo } from "@/lib/holidays"

// Group countries by continent for better organization
const continents = {
  "all": { title: "All Countries", label: "All", countries: COUNTRIES },
  "americas": {
    title: "Americas", label: "Americas",
    countries: COUNTRIES.filter(c => ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "VE"].includes(c.code))
  },
  "europe": {
    title: "Europe", label: "Europe",
    countries: COUNTRIES.filter(c => ["GB", "DE", "FR", "IT", "ES", "PT", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "GR", "IE"].includes(c.code))
  },
  "asia": {
    title: "Asia & Oceania", label: "Asia & Oceania",
    countries: COUNTRIES.filter(c => ["CN", "JP", "IN", "SG", "AU", "NZ"].includes(c.code))
  },
  "africa": {
    title: "Africa & Middle East", label: "Africa & ME",
    countries: COUNTRIES.filter(c => ["ZA"].includes(c.code))
  },
}

export default function HolidaysClientPage() {
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en")
  const [activeTab, setActiveTab] = useState<string>("all")

  // Filter countries based on search term
  const filteredCountries = continents[activeTab as keyof typeof continents].countries.filter(country => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      country.name.toLowerCase().includes(searchLower) ||
      country.code.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Search input */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search countries..."
            aria-label="Search countries"
            className={cn(inputClass, "pl-11")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Language selector */}
        <SelectField id="holidays-lang" label="Select Language" value={selectedLanguage} onChange={setSelectedLanguage} className="w-full sm:w-[200px]">
          {SUPPORTED_LANGUAGES.map((lang: LanguageInfo) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </SelectField>
      </div>

      {/* Tabs for continents */}
      <div role="tablist" aria-label="Continent" className="mb-8 inline-flex max-w-full flex-wrap gap-0.5 rounded-full border border-line bg-surface p-1">
        {Object.entries(continents).map(([key, c]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", activeTab === key ? "bg-ink text-btn-ink" : "text-subtle hover:text-ink")}
          >
            {c.label}
          </button>
        ))}
      </div>

      <h2 className="m-0 mb-4 text-xl font-semibold tracking-[-0.02em]">{continents[activeTab as keyof typeof continents].title}</h2>
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))" }}>
        {filteredCountries.map((country: CountryInfo) => (
          <Link
            key={country.code}
            href={`${getLocalePath(`/holidays/${country.code.toLowerCase()}`, locale)}?lang=${selectedLanguage}`}
            className={cn(cardClass, "flex items-center justify-between gap-3 p-[18px] transition-colors hover:border-ink")}
          >
            <h3 className="m-0 min-w-0 text-base font-semibold tracking-[-0.01em]">{country.name}</h3>
            <span className={cn(monoLabel, "flex-none rounded-full border border-line2 px-2.5 py-[3px]")}>{country.code}</span>
          </Link>
        ))}
        {filteredCountries.length === 0 && <p className="text-subtle">No countries found.</p>}
      </div>
    </div>
  )
}
