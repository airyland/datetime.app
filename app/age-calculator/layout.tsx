import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Age Calculator | Calculate Your Exact Age | Datetime.app",
  description: "Calculate your exact age in years, months, days, hours, minutes, and seconds. Choose between calendar or manual input and calculate age as of any date.",
  keywords: ["age calculator", "calculate age", "how old am I", "exact age", "age in years", "age in days", "birthday calculator", "time since birth", "age between dates", "age on specific date"],
  openGraph: {
    title: "Age Calculator | Calculate Your Exact Age | Datetime.app",
    description: "Calculate your exact age in years, months, days, hours, minutes, and seconds. Choose between calendar or manual input and calculate age as of any date.",
    type: "website",
  },
  alternates: {
    canonical: "https://datetime.app/age-calculator"
  }
}

export default function AgeCalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
