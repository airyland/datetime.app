import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'utc' });
  
  if (locale === 'zh-hans') {
    return {
      title: "UTC时间 | 协调世界时",
      description: t('description'),
      keywords: ["UTC", "协调世界时", "世界时间", "标准时间", "GMT", "格林威治标准时间", "时区转换"],
      openGraph: {
        title: "UTC时间 | 协调世界时",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: "UTC時間 | 協調世界時",
      description: t('description'),
      keywords: ["UTC", "協調世界時", "世界時間", "標準時間", "GMT", "格林威治標準時間", "時區轉換"],
      openGraph: {
        title: "UTC時間 | 協調世界時",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  // Default English metadata
  return {
    title: "UTC Time | Datetime.app",
    description: "View current UTC (Coordinated Universal Time). UTC is the world's time standard, unaffected by time zones or daylight saving time changes.",
    keywords: ["UTC", "Coordinated Universal Time", "world time", "standard time", "GMT", "Greenwich Mean Time", "timezone conversion"],
    openGraph: {
      title: "UTC Time | Datetime.app",
      description: "View current UTC (Coordinated Universal Time). UTC is the world's time standard, unaffected by time zones or daylight saving time changes.",
      type: "website",
    },
  };
}

export default function UTCLayout({ children }: LayoutProps) {
  return <>{children}</>
}
