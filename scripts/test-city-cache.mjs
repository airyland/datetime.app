import assert from 'node:assert/strict'
import test from 'node:test'

const origin = new URL(process.env.CITY_CACHE_TEST_ORIGIN ?? 'http://localhost:43174')
const get = path => fetch(new URL(path, origin), { signal: AbortSignal.timeout(10000) })

test('city HTML is reused for one hour without embedding a stale clock', async () => {
  const path = '/cities/london'
  const first = await get(path)
  assert.equal(first.status, 200)
  assert.match(first.headers.get('cache-control') ?? '', /\bs-maxage=3600\b/)
  const html = await first.text()
  assert.match(html, /<h1[^>]*>[^<]*London/)
  assert.match(html, /<time>--:--<span[^>]*>:--<\/span><\/time>/)
  const responses = await Promise.all(Array.from({ length: 8 }, () => get(path)))
  for (const response of responses) {
    assert.equal(response.headers.get('x-nextjs-cache'), 'HIT')
    assert.equal(response.headers.get('etag'), first.headers.get('etag'))
    await response.arrayBuffer()
  }
})

test('city and locale variants have independent content', async () => {
  const paths = ['/cities/london', '/zh-hans/cities/london', '/cities/tokyo']
  const [english, chinese, tokyo] = await Promise.all(paths.map(async path => {
    const response = await get(path)
    assert.equal(response.status, 200)
    return response.text()
  }))
  assert.match(english, /<html[^>]*lang="en"/)
  assert.match(chinese, /<html[^>]*lang="zh-hans"/)
  assert.match(chinese, /英国伦敦当前时间/)
  assert.match(tokyo, /Asia\/Tokyo/)
})

test('unknown and inherited keys return 404', async () => {
  for (const city of ['not-a-real-city', '__proto__', 'constructor', 'toString']) {
    const response = await get('/cities/' + city)
    assert.equal(response.status, 404, city)
    await response.arrayBuffer()
  }
})
