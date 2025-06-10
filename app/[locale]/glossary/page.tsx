"use client"

import { useState } from "react"
import Link from "next/link"
import { glossaryItems } from "./glossary-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Book, Search } from "lucide-react"

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Group items by category
  const categories = {
    standard: { title: "Time Standards", items: [] as string[] },
    format: { title: "Time Formats", items: [] as string[] },
    concept: { title: "Time Concepts", items: [] as string[] },
    timezone: { title: "Timezone Related", items: [] as string[] },
    calculation: { title: "Time Calculations", items: [] as string[] },
  }
  
  // Populate categories
  Object.entries(glossaryItems).forEach(([id, item]) => {
    categories[item.category as keyof typeof categories].items.push(id)
  })
  
  // Filter items based on search term
  const filteredItems = Object.entries(glossaryItems).filter(([_, item]) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.shortDescription.toLowerCase().includes(searchLower)
    )
  })

  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Datetime.app
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">Toggle theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Glossary of Datetime Concepts
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive reference for time-related terminology and concepts
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search glossary terms..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm ? (
            // Search results
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results ({filteredItems.length})</h2>
              {filteredItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredItems.map(([id, item]) => (
                    <Link 
                      key={id} 
                      href={`/glossary/${id}`}
                      className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No matching terms found. Try a different search term.
                </p>
              )}
            </div>
          ) : (
            // Categorized listing
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto mb-6">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  <span>All Terms</span>
                </TabsTrigger>
                {Object.entries(categories).map(([key, category]) => (
                  <TabsTrigger key={key} value={key}>
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(glossaryItems).map(([id, item]) => (
                    <Link 
                      key={id} 
                      href={`/glossary/${id}`}
                      className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              {Object.entries(categories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {category.items.map((id) => (
                      <Link 
                        key={id} 
                        href={`/glossary/${id}`}
                        className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <h3 className="font-bold mb-1">{glossaryItems[id].title}</h3>
                        <p className="text-sm text-muted-foreground">{glossaryItems[id].shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </main>
  )
}
