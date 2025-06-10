"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { glossaryItems } from "../glossary-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Book, ExternalLink } from "lucide-react"

interface TermPageProps {
  params: { term: string }
}

export default function TermPage({ params }: TermPageProps) {
  const { term } = params
  const termInfo = glossaryItems[term]
  
  // If term doesn't exist, show 404
  if (!termInfo) {
    notFound()
  }
  
  // Format the long description with paragraphs
  const formattedDescription = termInfo.longDescription.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ))
  
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/glossary" 
              className="inline-flex items-center text-primary hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Glossary
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {termInfo.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {termInfo.shortDescription}
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              {formattedDescription}
            </div>
          </div>
          
          {/* Related Terms */}
          {termInfo.relatedTerms.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Related Terms
                </h2>
                <div className="flex flex-wrap gap-2">
                  {termInfo.relatedTerms.map((relatedTerm) => (
                    <Link
                      key={relatedTerm}
                      href={`/glossary/${relatedTerm}`}
                      className="px-3 py-1 bg-accent/50 hover:bg-accent rounded-full text-sm transition-colors"
                    >
                      {glossaryItems[relatedTerm]?.title || relatedTerm}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* References */}
          {termInfo.references && termInfo.references.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  References
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {termInfo.references.map((reference, index) => (
                    <li key={index}>{reference}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
