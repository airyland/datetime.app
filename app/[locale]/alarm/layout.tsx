import { redirect } from "next/navigation"

export default async function AlarmLayout({ params, children }: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
  const { locale } = await params
  // The alarm page is English-only (like /countdown and /holidays)
  if (locale !== "en") redirect("/alarm")
  return <>{children}</>
}
