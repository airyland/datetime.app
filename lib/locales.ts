export const DEFAULT_LOCALE = 'en' as const

export const LOCALE_PREFIXES = [
  'zh-hans',
  'zh-hant',
  'ar',
  'de',
  'es',
  'fr',
  'hi',
  'it',
  'ja',
  'ko',
  'pt',
  'ru',
  'tr'
] as const

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...LOCALE_PREFIXES] as const

export type Locale = typeof SUPPORTED_LOCALES[number]

export const LANGUAGE_OPTIONS: ReadonlyArray<{ code: Locale; name: string }> = [
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
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' }
] as const
