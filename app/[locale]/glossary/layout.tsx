interface LayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export default function GlossaryLayout({ params, children }: LayoutProps) {
  return <>{children}</>
}
