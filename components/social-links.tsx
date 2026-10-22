import { Github } from 'lucide-react'

const base =
  "inline-flex size-9 items-center justify-center rounded-full border border-foot-line text-foot-muted transition-colors hover:border-foot-muted hover:text-foot-ink"

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2.5">
      <a href="https://github.com/airyland/datetime.app" target="_blank" rel="noopener noreferrer" className={base} title="GitHub" aria-label="GitHub">
        <Github className="size-[17px]" aria-hidden="true" />
      </a>
      <a href="https://x.com/we_webmaster" target="_blank" rel="noopener noreferrer" className={base} title="X (Twitter)" aria-label="X (Twitter)">
        <svg className="size-[15px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a href="https://www.producthunt.com/products/datetime-app-world-clock-time" target="_blank" rel="noopener noreferrer" className={base} title="Product Hunt" aria-label="Product Hunt">
        <svg className="size-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 0 0 0-3.6zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.8V6h5.804a4.2 4.2 0 0 1 0 8.4z" />
        </svg>
      </a>
    </div>
  )
}
