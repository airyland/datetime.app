interface LayoutProps {
  params: { term: string; locale: string };
  children: React.ReactNode;
}

export default function TermLayout({ params, children }: LayoutProps) {
  return <>{children}</>
}
