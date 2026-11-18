import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { holidayQuerySchema } from '../holiday-query.ts'
import { getHolidays, createHolidayCalculator } from './holidays.ts'
import { createBoundedWorkerRunner } from './bounded-worker.ts'
const query = {country:'CN',year:2026,language:'en'}

test('strict year validation rejects the profiled hang and malformed values', async () => {
  for (const year of ['999999999','-99999999','NaN','Infinity','2026abc','2026.5','02026','1899','2101','','2026\n']) {
    assert.equal(holidayQuerySchema.safeParse({country:'CN',year}).success,false,year)
  }
  for (const year of [1900,2100,2026]) assert.equal(holidayQuerySchema.parse({country:'cn',year:String(year)}).year,year)
  let calls=0;const calculate=createHolidayCalculator({run:async()=>{calls++;return []}})
  for(const year of [999999999,NaN,Infinity,2026.5,-99999999]) await assert.rejects(calculate({...query,year}))
  assert.equal(calls,0)
  for (const data of [{country:'CN;echo hi'},{country:'CN',language:'x'.repeat(200)},{country:'CN',region:'../x'},{country:['CN']},{country:'CN',extra:1}]) assert.equal(holidayQuerySchema.safeParse(data).success,false)
})

test('valid calendars preserve real library output across year boundaries and regions', async () => {
  const Holidays=createRequire(import.meta.url)('date-holidays')
  for(const [country,year,language,region] of [['CN',1900,'zh'],['CN',2100,'en'],['GB',2026,'en'],['US',2026,'en','CA']]) {
    const actual=await getHolidays({country,year,language,region})
    const hd=new Holidays();hd.init(country,region);hd.setLanguages(language)
    assert.deepEqual(actual.map(h=>[h.date,h.start.toISOString(),h.end.toISOString(),h.name,h.type]),hd.getHolidays(year).map(h=>[h.date,h.start.toISOString(),h.end.toISOString(),h.name,h.type]))
  }
})

test('an infinite calculation is terminated without blocking the main thread and capacity recovers', async () => {
  const run=createBoundedWorkerRunner({source:`const {parentPort,workerData}=require('node:worker_threads');if(workerData.block){for(;;){}}parentPort.postMessage(42)`,maxConcurrent:1,timeoutMs:200,maxOutputBytes:100,parse:v=>{assert.equal(v,42);return v}})
  let beats=0;const timer=setInterval(()=>beats++,10)
  try {
    const stuck=run({block:true});const failed=assert.rejects(stuck,e=>e.code==='TIMEOUT')
    await assert.rejects(run({block:false}),e=>e.code==='BUSY')
    await failed;assert(beats>=5,`event loop must stay responsive: ${beats}`)
    assert.equal(await run({block:false}),42)
  } finally {clearInterval(timer)}
})

test('worker failures, malformed output and output overflow are bounded and sanitized', async () => {
  for(const [source,code] of [[`throw Error('SECRET_MARKER')`,'FAILED'],[`require('node:worker_threads').parentPort.postMessage('x'.repeat(200))`,'OUTPUT_LIMIT'],[`require('node:worker_threads').parentPort.postMessage({bad:true})`,'FAILED']]) {
    const run=createBoundedWorkerRunner({source,maxConcurrent:1,timeoutMs:1000,maxOutputBytes:100,parse:()=>{throw Error('SECRET_MARKER')}})
    await assert.rejects(run({}),e=>e.code===code&&!e.message.includes('SECRET_MARKER'))
  }
})

test('cache coalesces bounded in-flight work, isolates returned values, expires and evicts', async () => {
  let calls=0,time=0,release
  const blocked=new Promise(resolve=>release=resolve)
  const calculate=createHolidayCalculator({cacheLimit:2,now:()=>time,run:async q=>{calls++;if(q.year===2026)await blocked;return []}})
  const one=calculate(query),same=calculate(query),two=calculate({...query,year:2027})
  await assert.rejects(calculate({...query,year:2028}),e=>e.code==='BUSY')
  release();await Promise.all([one,same,two]);assert.equal(calls,2)
  const a=await calculate(query);a.push({bad:true});assert.deepEqual(await calculate(query),[])
  await calculate({...query,year:2028});await calculate({...query,year:2027});assert.equal(calls,4)
  time=3600001;await calculate({...query,year:2027});assert.equal(calls,5)
})

test('failed calculations do not poison the cache or retain concurrency slots', async () => {
  let calls=0;const calculate=createHolidayCalculator({run:async()=>{if(++calls===1)throw Error('fixture failure');return []}})
  await assert.rejects(calculate(query));assert.deepEqual(await calculate(query),[]);assert.equal(calls,2)
})

test('unsupported calendar selections fail explicitly instead of returning fabricated holidays', async () => {
  await assert.rejects(getHolidays({country:'ZZ',year:2026,language:'en'}), e=>e.code==='INVALID_INPUT')
})
