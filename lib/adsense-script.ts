export const ADSENSE_PUBLISHER_ID = 'ca-pub-8443907573529681'
const adsenseUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

export function appendAdSenseScript(doc: Document) {
  if (doc.head.querySelector(`script[src^="${adsenseUrl}"]`)) return

  // AdSense validates this tag. Keep it in Google's format without framework attributes.
  const script = doc.createElement('script')
  script.async = true
  script.src = `${adsenseUrl}?client=${ADSENSE_PUBLISHER_ID}`
  script.crossOrigin = 'anonymous'
  doc.head.appendChild(script)
}
