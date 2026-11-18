import assert from 'node:assert/strict'
import test from 'node:test'
import { ADSENSE_PUBLISHER_ID, appendAdSenseScript } from '../lib/adsense-script.ts'

test('AdSense gets only its standard script attributes and is appended once', () => {
  const scripts = []
  const document = {
    head: {
      querySelector(selector) {
        assert.equal(selector, 'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
        return scripts[0]
      },
      appendChild(script) { scripts.push(script) },
    },
    createElement(tag) {
      assert.equal(tag, 'script')
      return {}
    },
  }
  appendAdSenseScript(document)
  appendAdSenseScript(document)
  assert.deepEqual(scripts, [{
    async: true,
    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_PUBLISHER_ID,
    crossOrigin: 'anonymous',
  }])
})
