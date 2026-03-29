"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import StructuredData from "./structured-data"
import { DEFAULT_LOCALE, LOCALE_PREFIXES } from "@/lib/locales"

const formatSegment = (segment: string) => {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function BreadcrumbStructuredData() {
  const pathname = usePathname()
  const tCommon = useTranslations("common")

  const segments = pathname.split("/").filter(Boolean)
  const [maybeLocale, ...rest] = segments
  const locale = LOCALE_PREFIXES.includes(maybeLocale as typeof LOCALE_PREFIXES[number]) ? maybeLocale : DEFAULT_LOCALE
  const pathSegments = locale === DEFAULT_LOCALE ? segments : rest

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: tCommon("links.titleHome"),
      item: `https://datetime.app${locale === DEFAULT_LOCALE ? "" : `/${locale}`}`,
    },
  ]

  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: formatSegment(segment),
      item: `https://datetime.app${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${currentPath}`,
    })
  })

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      }}
    />
  )
}
