import { Metadata } from "next"
import { getTranslations } from 'next-intl/server'
import { locales } from '@/i18n/request'

interface LayoutProps {
  params: { locale: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'ageCalculator' });
  
  // Generate alternate language links for all supported locales
  const languages = locales.reduce((acc, loc) => {
    if (loc === 'en') {
      acc[loc] = `https://datetime.app/age-calculator`;
    } else {
      acc[loc] = `https://datetime.app/${loc}/age-calculator`;
    }
    return acc;
  }, {} as Record<string, string>);
  
  if (locale === 'zh-hans') {
    return {
      title: "年龄计算器 | 计算您的精确年龄 | Datetime.app",
      description: t('description'),
      keywords: ["年龄计算器", "计算年龄", "我多少岁", "精确年龄", "年龄计算", "生日计算器"],
      alternates: {
        canonical: `https://datetime.app/zh-hans/age-calculator`,
        languages
      },
      openGraph: {
        title: "年龄计算器 | 计算您的精确年龄 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  if (locale === 'zh-hant') {
    return {
      title: "年齡計算器 | 計算您的精確年齡 | Datetime.app",
      description: t('description'),
      keywords: ["年齡計算器", "計算年齡", "我多少歲", "精確年齡", "年齡計算", "生日計算器"],
      alternates: {
        canonical: `https://datetime.app/zh-hant/age-calculator`,
        languages
      },
      openGraph: {
        title: "年齡計算器 | 計算您的精確年齡 | Datetime.app",
        description: t('description'),
        type: "website",
      },
    };
  }
  
  // Default English metadata
  return {
    title: "Age Calculator | Calculate Your Exact Age | Datetime.app",
    description: "Calculate your exact age in years, months, days, hours, minutes, and seconds. Choose between calendar or manual input and calculate age as of any date.",
    keywords: ["age calculator", "calculate age", "how old am I", "exact age", "age in years", "age in days", "birthday calculator", "time since birth", "age between dates", "age on specific date"],
    alternates: {
      canonical: `https://datetime.app/age-calculator`,
      languages
    },
    openGraph: {
      title: "Age Calculator | Calculate Your Exact Age | Datetime.app",
      description: "Calculate your exact age in years, months, days, hours, minutes, and seconds. Choose between calendar or manual input and calculate age as of any date.",
      type: "website",
    },
  };
}

export default function AgeCalculatorLayout({ children }: LayoutProps) {
  return <>{children}</>
}
