export const dynamic = "force-dynamic"
export const metadata = { title: "Current year | Datetime.app", robots: { index: false } }

export default async function EmbedYear({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const { theme } = await searchParams
  const dark = theme === "dark"
  const year = new Date().getUTCFullYear()
  return (
    <html lang="en">
      <body style={{ margin: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0D0E10" : "#FFFFFF", color: dark ? "#ECECE8" : "#101114", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <span style={{ fontSize: "min(60vh, 22vw)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{year}</span>
      </body>
    </html>
  )
}
