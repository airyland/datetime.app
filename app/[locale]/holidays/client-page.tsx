"use client"

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Globe, Search } from "lucide-react"
import { COUNTRIES, SUPPORTED_LANGUAGES, CountryInfo, LanguageInfo } from "@/lib/holidays"

// Group countries by continent for better organization
const continents = {
  "all": { title: "All Countries", countries: COUNTRIES },
  "americas": { 
    title: "Americas", 
    countries: COUNTRIES.filter(c => 
      ["US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "VE"].includes(c.code)
    ) 
  },
  "europe": { 
    title: "Europe", 
    countries: COUNTRIES.filter(c => 
      ["GB", "DE", "FR", "IT", "ES", "PT", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "GR", "IE"].includes(c.code)
    ) 
  },
  "asia": { 
    title: "Asia & Oceania", 
    countries: COUNTRIES.filter(c => 
      ["CN", "JP", "IN", "SG", "AU", "NZ"].includes(c.code)
    ) 
  },
  "africa": { 
    title: "Africa & Middle East", 
    countries: COUNTRIES.filter(c => 
      ["ZA"].includes(c.code)
    ) 
  },
}

export default function HolidaysClientPage() {
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
      {/* Language selector */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xs">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang: LanguageInfo) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search countries..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs for continents */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="americas">Americas</TabsTrigger>
          <TabsTrigger value="europe">Europe</TabsTrigger>
          <TabsTrigger value="asia">Asia & Oceania</TabsTrigger>
          <TabsTrigger value="africa">Africa & ME</TabsTrigger>
        </TabsList>

        {Object.entries(continents).map(([key, continent]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{continent.title}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {filteredCountries.map((country: CountryInfo) => (
                <Link 
                  key={country.code} 
                  href={`/holidays/${country.code.toLowerCase()}?lang=${selectedLanguage}`}
                  className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-bold">{country.name}</h3>
                      <p className="text-sm text-muted-foreground">{country.code}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
