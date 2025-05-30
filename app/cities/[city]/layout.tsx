import { citiesData } from './metadata'

interface LayoutProps {
  params: { city: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps) {
  const cityInfo = citiesData[params.city as keyof typeof citiesData];
  
  return {
    title: `Current Time in ${cityInfo.name}, ${cityInfo.country} | Datetime.app`,
    description: `Current local time in ${cityInfo.name}, ${cityInfo.country} (${cityInfo.timezone} time zone)`,
    alternates: {
      canonical: `https://datetime.app/cities/${params.city}`
    }
  }
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
