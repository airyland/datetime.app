import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://datetime.app"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
