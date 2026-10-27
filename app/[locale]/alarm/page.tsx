import { Metadata } from "next"
import { Bell, MonitorSmartphone, Volume2 } from "lucide-react"
import { Faq, PageIntro, Section, SectionHeading, cardClass } from "@/components/ds"
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { OG_IMAGES, TWITTER_IMAGES } from "@/lib/seo"
import AlarmClient from "./alarm-client"

const TITLE = "Online Alarm Clock | Datetime.app"
const DESCRIPTION =
  "Free online alarm clock that runs in your browser. Set one or more alarms, repeat on chosen weekdays, snooze, and pick a built-in tone or your own audio file. No sign-up."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["online alarm clock", "browser alarm", "web alarm", "alarm with custom sound", "free alarm clock"],
  alternates: { canonical: "https://datetime.app/alarm" },
  openGraph: { images: OG_IMAGES, title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: TWITTER_IMAGES },
}

const faqs = [
  {
    q: "Does the alarm work if I close the tab?",
    a: "No. The alarm runs inside this page, so the tab has to stay open (it can be in the background or on another window). If the tab is closed or the computer sleeps, the alarm cannot ring.",
  },
  {
    q: "Can I use my own sound?",
    a: "Yes. Choose \"Your own file\" in the sound menu and pick any audio file from your device. Files up to about 1.5 MB are remembered between visits; larger files only last until you reload.",
  },
  {
    q: "Where are my alarms stored?",
    a: "Only in your browser (local storage). Nothing is sent to a server, and alarms are not shared between devices.",
  },
  {
    q: "Why didn't I hear anything?",
    a: "Browsers block sound until you have interacted with the page. Click \"Test sound\" once after opening the page, and check that the tab is not muted and the device volume is up.",
  },
]

const infoCards = [
  { icon: Bell, title: "Several alarms", desc: "Add as many alarms as you need, label them, and switch each one on or off without deleting it." },
  { icon: Volume2, title: "Your sound", desc: "Pick a built-in tone or load your own audio file. Snooze for 5 minutes or dismiss when it rings." },
  { icon: MonitorSmartphone, title: "Runs in the browser", desc: "No app and no account. Keep the tab open and the alarm follows your device's local time." },
]

export default function AlarmPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Home", href: "/" }, { label: "Alarm" }]}
        eyebrow="Alarm"
        eyebrowAs="p"
        title="Online alarm clock"
        description="Set alarms that ring in your browser, with repeat days, snooze and your own sound."
      />

      <Section top="clamp(8px,2vw,24px)">
        <AlarmClient />
      </Section>

      <Section top="clamp(40px,5vw,64px)">
        <SectionHeading title="About this alarm" />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))" }}>
          {infoCards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${cardClass} px-7 py-[26px]`}>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line2 text-brand">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <h3 className="m-0 text-lg font-semibold tracking-[-0.015em]">{title}</h3>
              </div>
              <p className="m-0 mt-3.5 text-[15px] leading-[1.7] text-subtle">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Faq title="Frequently asked questions" items={faqs} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://datetime.app" },
          { name: "Online Alarm Clock", url: "https://datetime.app/alarm" },
        ]}
      />
      <div className="pb-[clamp(56px,8vw,96px)]" />
    </>
  )
}
