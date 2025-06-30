"use client"

import Link from "next/link"
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"

export default function Header() {
  const t = useTranslations('home')
  const commonT = useTranslations('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Datetime.app
        </Link>
        
        {/* Desktop navigation - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
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
        
        <div className="flex items-center gap-2">
          {/* Mobile menu button - shown only on mobile */}
          <Button
            variant="ghost"
            className="md:hidden w-auto border-none shadow-none p-2 h-auto bg-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
          
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-border">
          <div className="flex flex-col gap-3">
            <Link 
              href="/utc" 
              className="text-sm font-medium hover:opacity-80 transition-opacity px-2 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {commonT('nav.utc')}
            </Link>
            <Link 
              href="/holidays" 
              className="text-sm font-medium hover:opacity-80 transition-opacity px-2 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {commonT('nav.holidays')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
