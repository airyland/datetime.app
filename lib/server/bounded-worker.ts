import { Worker } from 'node:worker_threads'

export class IsolatedTaskError extends Error {
  readonly code: 'BUSY' | 'TIMEOUT' | 'FAILED' | 'OUTPUT_LIMIT' | 'INVALID_INPUT'
  constructor(code: 'BUSY' | 'TIMEOUT' | 'FAILED' | 'OUTPUT_LIMIT' | 'INVALID_INPUT') {
    super(`Isolated calculation ${code.toLowerCase()}`)
    this.code = code
  }
}

// Fixed application-owned worker code only; never expose this interface as an API.
export function createBoundedWorkerRunner<Input, Output>(options: {
  source: string
  maxConcurrent: number
  timeoutMs: number
  maxOutputBytes: number
  parse: (value: unknown) => Output
}) {
  let active = 0
  return async (input: Input): Promise<Output> => {
    if (active >= options.maxConcurrent) throw new IsolatedTaskError('BUSY')
    active++
    let worker: Worker | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      return await new Promise<Output>((resolve, reject) => {
        worker = new Worker(options.source, {
          eval: true, execArgv: [], workerData: input, stdout: true, stderr: true,
          resourceLimits: { maxOldGenerationSizeMb: 96, maxYoungGenerationSizeMb: 16, stackSizeMb: 4 },
        })
        worker.stdout?.resume()
        worker.stderr?.resume()
        timer = setTimeout(() => reject(new IsolatedTaskError('TIMEOUT')), options.timeoutMs)
        worker.once('message', value => {
          try {
            if (Buffer.byteLength(JSON.stringify(value)) > options.maxOutputBytes) {
              reject(new IsolatedTaskError('OUTPUT_LIMIT'))
            } else resolve(options.parse(value))
          } catch (error) { reject(error instanceof IsolatedTaskError ? error : new IsolatedTaskError('FAILED')) }
        })
        worker.once('error', () => reject(new IsolatedTaskError('FAILED')))
        worker.once('exit', () => reject(new IsolatedTaskError('FAILED')))
      })
    } finally {
      if (timer) clearTimeout(timer)
      try { await worker?.terminate() } finally { active-- }
    }
  }
}
