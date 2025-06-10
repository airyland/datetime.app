import { Metadata } from "next"
import { glossaryItems } from "../glossary-data"

interface LayoutProps {
  params: { term: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const term = params.term;
  const termInfo = glossaryItems[term];
  
  if (!termInfo) {
    return {
      title: "Term Not Found | Datetime.app",
      description: "The requested datetime term could not be found.",
    };
  }
  
  return {
    title: `${termInfo.title} - Datetime Glossary | Datetime.app`,
    description: termInfo.shortDescription,
    keywords: [termInfo.title, ...termInfo.relatedTerms, "datetime", "time", "glossary"],
    openGraph: {
      title: `${termInfo.title} - Datetime Glossary | Datetime.app`,
      description: termInfo.shortDescription,
      type: "website",
    },
    alternates: {
      canonical: `https://datetime.app/glossary/${params.term}`
    }
  };
}

export default function TermLayout({ children }: LayoutProps) {
  return <>{children}</>
}
