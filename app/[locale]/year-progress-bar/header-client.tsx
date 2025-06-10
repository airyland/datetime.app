"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from 'next-intl'

export default function HeaderClient() {
  const t = useTranslations('yearProgress')
  
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
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
  )
}
