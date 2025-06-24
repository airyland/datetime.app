"use client"

import Link from "next/link"
import { useTranslations } from 'next-intl'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Header() {
  const t = useTranslations('home')
  const commonT = useTranslations('common')
  
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center relative">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        Datetime.app
      </Link>
      <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
        <Link 
          href="/utc" 
          className="text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {commonT('nav.utc')}
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link 
          href="/holidays" 
          className="text-sm font-medium hover:opacity-80 transition-opacity"
        >
          {commonT('nav.holidays')}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
