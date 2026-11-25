const TRACKER_SCRIPT_SRC = "https://t.query.domains/script.js"

/** First-party page view tracker (t.query.domains). Records the initial page load only. */
export function TrackerScript() {
  return <script defer src={TRACKER_SCRIPT_SRC} />
}
