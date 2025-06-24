'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  
  // Determine current locale from pathname if useLocale() doesn't work correctly
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const locales = ['zh-hans', 'zh-hant', 'ar', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pt', 'ru']
    if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
      return pathSegments[0]
    }
    return 'en'
  }
  
  // Always use getCurrentLocale() as it's more reliable for our setup
  const currentLocale = getCurrentLocale()

  const handleLocaleChange = (newLocale: string) => {
    // Parse the pathname to get the base path without locale
    const pathSegments = pathname.split('/').filter(Boolean)
    let basePath = '/'
    
    // If current locale is not English and the first segment is the locale, remove it
    if (currentLocale !== 'en' && pathSegments.length > 0 && pathSegments[0] === currentLocale) {
      const remainingSegments = pathSegments.slice(1)
      basePath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
    } else if (currentLocale === 'en') {
      // For English, the entire pathname is the base path
      basePath = pathname
    }
    
    // Build new path
    let newPath
    if (newLocale === 'en') {
      // For English, use the base path (without locale prefix)
      newPath = basePath
    } else {
      // For other languages, add locale prefix
      newPath = basePath === '/' ? `/${newLocale}` : `/${newLocale}${basePath}`
    }
    
    router.push(newPath)
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale)

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-auto border-none shadow-none p-2 h-auto bg-transparent hover:bg-accent hover:text-accent-foreground">
        <Globe className="w-4 h-4" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}