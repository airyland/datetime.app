"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  title: string
  faqs: FAQ[]
}

export default function FAQSection({ title, faqs }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto text-left">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              aria-expanded={openItems.has(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="font-medium text-sm md:text-base pr-4 m-0">{faq.question}</h3>
              {openItems.has(index) ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              )}
            </button>
            
            {/* Content is always rendered for SEO, but visually hidden when closed */}
            <div
              id={`faq-answer-${index}`}
              className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                openItems.has(index) 
                  ? 'pb-4 max-h-none opacity-100' 
                  : 'max-h-0 opacity-0 pb-0'
              }`}
            >
              <div className={openItems.has(index) ? 'block' : 'sr-only'}>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
              
              {/* Always visible to search engines but hidden from visual users when collapsed */}
              {!openItems.has(index) && (
                <div className="sr-only">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}