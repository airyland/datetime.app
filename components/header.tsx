"use client"

import Link from "next/link"
import { useTranslations } from 'next-intl'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Header() {
  const t = useTranslations('home')
  
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        Datetime.app
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:inline">{t('labels.toggleTheme') || 'Toggle theme'}:</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
