import test from 'node:test'
import assert from 'node:assert/strict'
const origin=new URL(process.env.HOLIDAY_TEST_ORIGIN||'http://localhost:43174')
if(origin.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(origin.hostname))throw Error('Use a local production server for regression probes')
const get=path=>fetch(new URL(path,origin),{signal:AbortSignal.timeout(4000)})

test('SSR-first initialization preserves typed API failures across module graphs',async()=>{
 const page=await get('/holidays/gb?year=2026');assert.equal(page.status,200);await page.text()
 assert.equal((await get('/api/holidays?country=ZZ&year=2026')).status,400)
})

test('the profiled input is rejected and ordinary requests keep responding',async()=>{
 const bad=['999999999','-99999999','NaN','Infinity','2026abc','2026.5','02026','1899','2101','']
 const requests=bad.map(year=>get('/api/holidays?country=CN&year='+year))
 const ordinary=get('/ads.txt')
 for(const response of await Promise.all(requests))assert.equal(response.status,400)
 assert.equal((await ordinary).status,200)
 assert.equal((await get('/api/holidays?country=CN&year=2026&year=999999999')).status,400)
 assert.equal((await get('/api/holidays?country=CN&year=2026&command=x')).status,400)
})

test('real calendars and concurrent identical requests return valid data',async()=>{
 const responses=await Promise.all(Array.from({length:12},()=>get('/api/holidays?country=GB&year=2026')))
 for(const r of responses){assert.equal(r.status,200);const data=await r.json();assert(data.holidays.some(h=>h.name.includes('Christmas')))}
 const cn=await get('/api/holidays?country=CN&year=2026&language=zh');assert.equal(cn.status,200);assert((await cn.json()).holidays.length>5)
 assert.equal((await get('/api/holidays?country=ZZ&year=2026')).status,400)
 assert.equal((await get('/api/holidays?country=US&region=CA&year=2026')).status,200)
})

test('both server-rendered holiday entrypoints reject out-of-range years without hanging',async()=>{
 for(const path of ['/holidays/cn?year=999999999','/holidays/us/ca?year=999999999']){
  const r=await get(path),body=await r.text();assert(r.status===404||body.includes('NEXT_HTTP_ERROR_FALLBACK;404'),path)
 }
 assert.equal((await get('/ads.txt')).status,200)
})
