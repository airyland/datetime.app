'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { DEFAULT_LOCALE, LANGUAGE_OPTIONS, LOCALE_PREFIXES } from '@/lib/locales'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  // Determine current locale from pathname if useLocale() doesn't work correctly
  const getCurrentLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && LOCALE_PREFIXES.includes(pathSegments[0] as typeof LOCALE_PREFIXES[number])) {
      return pathSegments[0]
    }
    return DEFAULT_LOCALE
  }
  
  // Always use getCurrentLocale() as it's more reliable for our setup
  const currentLocale = getCurrentLocale()

  const handleLocaleChange = (newLocale: string) => {
    // Parse the pathname to get the base path without locale
    const pathSegments = pathname.split('/').filter(Boolean)
    let basePath = '/'
    
    // If current locale is not English and the first segment is the locale, remove it
    if (currentLocale !== DEFAULT_LOCALE && pathSegments.length > 0 && pathSegments[0] === currentLocale) {
      const remainingSegments = pathSegments.slice(1)
      basePath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
    } else if (currentLocale === DEFAULT_LOCALE) {
      // For English, the entire pathname is the base path
      basePath = pathname
    }

    // Build new path
    let newPath
    if (newLocale === DEFAULT_LOCALE) {
      // For English, use the base path (without locale prefix)
      newPath = basePath
    } else {
      // For other languages, add locale prefix
      newPath = basePath === '/' ? `/${newLocale}` : `/${newLocale}${basePath}`
    }
    
    router.push(newPath)
  }

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-auto border-none shadow-none p-2 h-auto bg-transparent hover:bg-accent hover:text-accent-foreground">
        <Globe className="w-4 h-4" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}