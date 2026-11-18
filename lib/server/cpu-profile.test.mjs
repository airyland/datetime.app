import test from 'node:test'
import assert from 'node:assert/strict'
import {once} from 'node:events'
import {url as inspectorUrl} from 'node:inspector'
import {createCpuProfilingWorker} from './cpu-profile.ts'

test('bounded worker profiling captures a blocked main thread without opening an inspector socket', async () => {
 assert.equal(inspectorUrl(),undefined)
 const worker=createCpuProfilingWorker(0);worker.ref()
 try {
  const [ready]=await once(worker,'message');assert.equal(ready.type,'ready')
  const url=`http://127.0.0.1:${ready.port}/cpu-profile`
  assert.equal((await fetch(url)).status,404)
  assert.equal((await fetch(url+'?duration=999',{method:'POST'})).status,404)
  assert.equal((await fetch(url,{method:'POST',body:'{}'})).status,400)
  const started=once(worker,'message')
  const response=fetch(url,{method:'POST'})
  const [message]=await started;assert.equal(message.type,'profile-started')
  function profileBlockingFixture(){const end=Date.now()+6000;let x=1;while(Date.now()<end)x=Math.sqrt(x+1);return x}
  profileBlockingFixture()
  const res=await response;assert.equal(res.status,200);assert.equal(res.headers.get('cache-control'),'no-store')
  const data=await res.json();assert.equal(data.version,1)
  assert(data.durationMs>=4900 && data.durationMs<5900,`worker must stop while main is still blocked: ${data.durationMs}`)
  assert(data.mainThreadHeartbeatLagMs>3000)
  assert(data.profile.nodes.some(n=>n.callFrame.functionName==='profileBlockingFixture'))
  assert(data.profile.nodes.every(n=>!/[?#]/.test(n.callFrame.url)))
  assert(data.profile.samples.length<=15000)
  assert.equal((await fetch(url,{method:'POST'})).status,429)
  assert.equal(inspectorUrl(),undefined)
 } finally {await worker.terminate()}
})
