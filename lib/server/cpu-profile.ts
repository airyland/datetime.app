import { Worker } from 'node:worker_threads'

export const PROFILE_DURATION_MS = 5000
export const PROFILE_PORT = 4717
const stateKey = Symbol.for('datetime.cpu-profile.worker')

// Fixed code, with no public inspector socket or caller-supplied JavaScript.
// Sampling and HTTP run outside the main event loop, including when it is blocked.
export const CPU_PROFILE_WORKER = String.raw`const {createServer} = require('node:http');
const {Session} = require('node:inspector/promises');
const {workerData,parentPort} = require('node:worker_threads');
const heartbeat = new BigInt64Array(workerData.heartbeat);
const PROFILE_DURATION_MS=5000, MAX_NODES=50000, MAX_SAMPLES=15000, MAX_BYTES=8388608;
async function captureCpuProfile() {
  const session = new Session()
  let maxLag = 0
  const delay = setInterval(() => { maxLag = Math.max(maxLag, Date.now() - Number(Atomics.load(heartbeat, 0))) }, 10)
  let running = false
  session.connectToMainThread()

  const startedAt = new Date().toISOString()
  const wall = performance.now()
  const cpu = process.cpuUsage()
  try {
    await session.post('Profiler.enable')
    await session.post('Profiler.setSamplingInterval', { interval: 1000 })
    await session.post('Profiler.start')
    running = true
    parentPort.postMessage({type:'profile-started'})
    await new Promise(resolve => setTimeout(resolve, PROFILE_DURATION_MS))
    const { profile } = await session.post('Profiler.stop')
    running = false
    if (profile.nodes.length > MAX_NODES || (profile.samples?.length ?? 0) > MAX_SAMPLES) throw new Error('PROFILE_LIMIT')
    const cleanText = (value, max) => value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max)
    const cleanUrl = (value) => {
      const path = value.split(/[?#]/, 1)[0] ?? ''
      // Never return data URLs, remote URLs, query strings or source text.
      return /^(?:file:\/\/\/|node:|\/|webpack:|turbopack:)/.test(path) ? cleanText(path, 512) : ''
    }
    const usage = process.cpuUsage(cpu)
    const observation = {
      version: 1,
      startedAt,
      collectedAt: new Date().toISOString(),
      durationMs: Math.round(performance.now() - wall),
      nodeVersion: process.versions.node,
      cpuMicros: { user: usage.user, system: usage.system },
      mainThreadHeartbeatLagMs: maxLag,
      profile: {
        startTime: profile.startTime,
        endTime: profile.endTime,
        nodes: profile.nodes.map(n => ({
          id: n.id,
          hitCount: n.hitCount ?? 0,
          children: n.children ?? [],
          callFrame: {
            functionName: cleanText(n.callFrame.functionName, 256),
            scriptId: /^\d+$/.test(n.callFrame.scriptId) ? n.callFrame.scriptId : '0',
            url: cleanUrl(n.callFrame.url),
            lineNumber: n.callFrame.lineNumber,
            columnNumber: n.callFrame.columnNumber,
          },
        })),
        samples: profile.samples ?? [],
        timeDeltas: profile.timeDeltas ?? [],
      },
    }
    if (Buffer.byteLength(JSON.stringify(observation)) > MAX_BYTES) throw new Error('PROFILE_LIMIT')
    return observation
  } finally {
    clearInterval(delay)
    try { if (running) await session.post('Profiler.stop') } finally { session.disconnect() }
  }
}

  let busy = false
  let lastStarted = -Infinity
  const server = createServer({ maxHeaderSize: 4096, requestTimeout: 10000, headersTimeout: 5000 }, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'application/json')
    const reply = (code, body) => { res.writeHead(code); res.end(JSON.stringify(body)) }
    if (req.socket.remoteAddress !== '127.0.0.1' || req.method !== 'POST' || req.url !== '/cpu-profile') return reply(404, { code: 'NOT_FOUND' })
    if (req.headers['transfer-encoding'] || (req.headers['content-length'] && req.headers['content-length'] !== '0')) return reply(400, { code: 'NO_BODY_ALLOWED' })
    if (busy || performance.now() - lastStarted < 30000) return reply(429, { code: 'PROFILE_BUSY' })
    busy = true
    lastStarted = performance.now()
    try { reply(200, await captureCpuProfile()) }
    catch(error) { parentPort.postMessage({type:'capture-failed',code:error?.message==='PROFILE_LIMIT'?'PROFILE_LIMIT':'INSPECTOR_ERROR'}); reply(503, { code: 'PROFILE_UNAVAILABLE' }) }
    finally { busy = false }
  })
  server.maxHeadersCount = 16
  server.listen(workerData.port, '127.0.0.1', () => parentPort.postMessage({type:'ready',port:server.address().port}))
  server.on('error', () => parentPort.postMessage({type:'unavailable'}))
`

export function createCpuProfilingWorker(port = PROFILE_PORT) {
  const heartbeat = new SharedArrayBuffer(8)
  const view = new BigInt64Array(heartbeat)
  const beat = () => Atomics.store(view, 0, BigInt(Date.now()))
  beat()
  const timer = setInterval(beat, 100)
  timer.unref()
  const worker = new Worker(CPU_PROFILE_WORKER, { eval: true, workerData: {port, heartbeat}, resourceLimits: {maxOldGenerationSizeMb:96,maxYoungGenerationSizeMb:16,stackSizeMb:4} })
  worker.on('exit', () => clearInterval(timer))
  worker.on('error', () => console.error('CPU_PROFILE_WORKER_UNAVAILABLE'))
  worker.unref()
  return worker
}

export function startCpuProfiling(): Worker | undefined {
  if (process.env.VIBEPLOY_NODE_CPU_PROFILING !== '1') return
  const globals = globalThis as typeof globalThis & { [stateKey]?: Worker }
  if (globals[stateKey]) return globals[stateKey]
  const worker = createCpuProfilingWorker()
  worker.on('message', message => {
    if (message?.type === 'unavailable') console.error('CPU_PROFILE_ENDPOINT_UNAVAILABLE')
    if (message?.type === 'capture-failed') console.error('CPU_PROFILE_CAPTURE_FAILED', message.code)
  })
  globals[stateKey] = worker
  return worker
}
