'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh-hans', name: '简体中文' },
  { code: 'zh-hant', name: '繁體中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' }
]

const STORAGE_KEY = 'language-preference'

interface LanguagePreference {
  dismissed: boolean
  preferredLocale?: string
  timestamp: number
}

export function LanguageSuggestionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestedLanguage, setSuggestedLanguage] = useState<{ code: string; name: string } | null>(null)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('languageSuggestion')

  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const locales = ['zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']
    if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
      return pathSegments[0]
    }
    return 'en'
  }

  const detectBrowserLanguage = (): string | null => {
    if (typeof window === 'undefined') return null
    
    const browserLang = navigator.language || navigator.languages?.[0]
    if (!browserLang) return null

    // Normalize browser language
    const normalizedLang = browserLang.toLowerCase()
    
    // Direct match
    if (languages.some(lang => lang.code === normalizedLang)) {
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
    const matchedLang = languages.find(lang => lang.code.startsWith(primaryLang))
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
    
    if (currentLocale !== 'en' && pathSegments.length > 0 && pathSegments[0] === currentLocale) {
      const remainingSegments = pathSegments.slice(1)
      basePath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
    } else if (currentLocale === 'en') {
      basePath = pathname
    }
    
    let newPath
    if (newLocale === 'en') {
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
    
    const suggestedLang = languages.find(lang => lang.code === browserLang)
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