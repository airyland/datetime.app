'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { DEFAULT_LOCALE, LANGUAGE_OPTIONS, LOCALE_PREFIXES } from '@/lib/locales'

const STORAGE_KEY = 'language-preference'

interface LanguagePreference {
  dismissed: boolean
  preferredLocale?: string
  timestamp: number
}

export function LanguageSuggestionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestedLanguage, setSuggestedLanguage] = useState<(typeof LANGUAGE_OPTIONS)[number] | null>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('languageSuggestion')

  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])) {
      return pathSegments[0]
    }
    return DEFAULT_LOCALE
  }

  const detectBrowserLanguage = (): string | null => {
    if (typeof window === 'undefined') return null
    
    const browserLang = navigator.language || navigator.languages?.[0]
    if (!browserLang) return null

    // Normalize browser language
    const normalizedLang = browserLang.toLowerCase()
    
    // Direct match
    if (LANGUAGE_OPTIONS.some(lang => lang.code === normalizedLang)) {
      return normalizedLang
    }
    
    // Match primary language (e.g., 'zh-cn' -> 'zh-hans', 'zh-tw' -> 'zh-hant')
    const primaryLang = normalizedLang.split('-')[0]
    
    if (primaryLang === 'zh') {
      // Special handling for Chinese variants
      if (normalizedLang.includes('cn') || normalizedLang.includes('hans')) {
        return 'zh-hans'
      } else if (normalizedLang.includes('tw') || normalizedLang.includes('hk') || normalizedLang.includes('hant')) {
        return 'zh-hant'
      }
      // Default to simplified Chinese
      return 'zh-hans'
    }
    
    // Find language by primary code
    const matchedLang = LANGUAGE_OPTIONS.find(lang => lang.code.startsWith(primaryLang))
    return matchedLang ? matchedLang.code : null
  }

  const getStoredPreference = (): LanguagePreference | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const savePreference = (preference: LanguagePreference) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preference))
    } catch {
      // Ignore storage errors
    }
  }

  const switchToLanguage = (newLocale: string) => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const currentLocale = getCurrentLocale()
    let basePath = '/'
    
    if (currentLocale !== DEFAULT_LOCALE && pathSegments.length > 0 && pathSegments[0] === currentLocale) {
      const remainingSegments = pathSegments.slice(1)
      basePath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
    } else if (currentLocale === DEFAULT_LOCALE) {
      basePath = pathname
    }

    let newPath
    if (newLocale === DEFAULT_LOCALE) {
      newPath = basePath
    } else {
      newPath = basePath === '/' ? `/${newLocale}` : `/${newLocale}${basePath}`
    }
    
    router.push(newPath)
  }

  const handleAccept = () => {
    if (suggestedLanguage) {
      savePreference({
        dismissed: false,
        preferredLocale: suggestedLanguage.code,
        timestamp: Date.now()
      })
      switchToLanguage(suggestedLanguage.code)
    }
    setIsOpen(false)
  }

  const handleDismiss = () => {
    savePreference({
      dismissed: true,
      timestamp: Date.now()
    })
    setIsOpen(false)
  }

  useEffect(() => {
    // Temporarily disable language suggestion dialog
    return
    
    if (typeof window === 'undefined') return

    const currentLocale = getCurrentLocale()
    const browserLang = detectBrowserLanguage()
    const storedPreference = getStoredPreference()
    
    // Don't show if user has dismissed or if browser language matches current locale
    if (!browserLang || browserLang === currentLocale) return
    
    // Check if user has dismissed or made a preference within the last 30 days
    if (storedPreference) {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
      if (storedPreference.timestamp > thirtyDaysAgo && storedPreference.dismissed) {
        return
      }
    }
    
    const suggestedLang = LANGUAGE_OPTIONS.find(lang => lang.code === browserLang)
    if (suggestedLang) {
      setSuggestedLanguage(suggestedLang)
      setIsOpen(true)
    }
  }, [pathname])

  if (!suggestedLanguage) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description', { language: suggestedLanguage.name })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={handleDismiss}>
            {t('dismiss')}
          </Button>
          <Button onClick={handleAccept}>
            {t('accept', { language: suggestedLanguage.name })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}