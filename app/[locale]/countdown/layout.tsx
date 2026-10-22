import { redirect } from "next/navigation"

export default async function CountdownLayout({ params, children }: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
  const { locale } = await params
  // Countdown pages are English-only (like /holidays)
  if (locale !== "en") redirect("/countdown")
  return <>{children}</>
}
