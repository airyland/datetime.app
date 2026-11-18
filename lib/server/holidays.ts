import { createRequire } from 'node:module'
import { join } from 'node:path'
import { z } from 'zod'
import { holidayCalculationSchema, type HolidayQuery } from '../holiday-query.ts'
import { createBoundedWorkerRunner, IsolatedTaskError } from './bounded-worker.ts'

export const HOLIDAY_WORKER_SOURCE = String.raw`
const { parentPort, workerData } = require('node:worker_threads');
const { modulePath, query } = workerData;
function calculate() {
if (!Number.isInteger(query.year) || query.year < 1900 || query.year > 2100) throw new Error('INVALID_YEAR');
const Holidays = require(modulePath);
const hd = new Holidays();
if (!Object.hasOwn(hd.getCountries('en'), query.country) ||
    (query.region && !Object.hasOwn(hd.getStates(query.country, 'en') || {}, query.region))) {
  return parentPort.postMessage({error:'INVALID_SELECTION'});
}
if (!hd.init(query.country, query.region)) return parentPort.postMessage({error:'INVALID_SELECTION'});
hd.setLanguages(query.language);
const holidays = hd.getHolidays(query.year);
if (holidays.length > 256) throw new Error('OUTPUT_LIMIT');
const result = holidays.map(h => ({date:h.date, start:h.start, end:h.end, name:h.name, type:h.type,
  ...(h.substitute === undefined ? {} : {substitute:h.substitute}),
  ...(h.note === undefined ? {} : {note:h.note})}));
if (Buffer.byteLength(JSON.stringify(result)) > 262144) throw new Error('OUTPUT_LIMIT');
parentPort.postMessage(result);
}
calculate();
`
const resultSchema = z.array(z.object({
  date: z.string().max(64), start: z.date(), end: z.date(), name: z.string().max(1024),
  type: z.enum(['public', 'bank', 'school', 'optional', 'observance']),
  substitute: z.boolean().optional(), note: z.string().max(1024).optional(),
}).strict()).max(256)
export type CalculatedHoliday = z.infer<typeof resultSchema>[number]
const run = createBoundedWorkerRunner<{modulePath: string; query: HolidayQuery}, CalculatedHoliday[]>({
  source: HOLIDAY_WORKER_SOURCE, maxConcurrent: 2, timeoutMs: 2000,
  maxOutputBytes: 262144, parse: value => {
    if (z.object({error:z.literal('INVALID_SELECTION')}).strict().safeParse(value).success) {
      throw new IsolatedTaskError('INVALID_INPUT')
    }
    return resultSchema.parse(value)
  },
})
export function createHolidayCalculator(options: {
  run: (query: HolidayQuery) => Promise<CalculatedHoliday[]>
  now?: () => number
  cacheLimit?: number
}) {
  const cache = new Map<string, {expires: number; value: CalculatedHoliday[]}>()
  const pending = new Map<string, Promise<CalculatedHoliday[]>>()
  const now = options.now ?? Date.now
  const cacheLimit = options.cacheLimit ?? 128
  if (!Number.isInteger(cacheLimit) || cacheLimit < 1 || cacheLimit > 128) throw new Error('Invalid cache limit')
  return async (input: HolidayQuery): Promise<CalculatedHoliday[]> => {
    const query = holidayCalculationSchema.parse(input)
    const key = JSON.stringify([query.country, query.year, query.language, query.region ?? null])
    const hit = cache.get(key)
    if (hit && hit.expires > now()) {
      cache.delete(key); cache.set(key, hit)
      return structuredClone(hit.value)
    }
    cache.delete(key)
    const current = pending.get(key)
    if (current) return structuredClone(await current)
    if (pending.size >= 2) throw new IsolatedTaskError('BUSY')
    const task = Promise.resolve().then(() => options.run(query)).then(value => {
      const parsed = resultSchema.parse(value)
      if (cache.size >= cacheLimit) cache.delete(cache.keys().next().value!)
      cache.set(key, {expires: now() + 60 * 60 * 1000, value: parsed})
      return parsed
    }).catch(error => {
      console.error('HOLIDAY_CALCULATION_UNAVAILABLE', error instanceof Error && 'code' in error ? error.code : 'FAILED')
      throw error
    }).finally(() => pending.delete(key))
    pending.set(key, task)
    return structuredClone(await task)
  }
}

// Next compiles API and SSR into separate module graphs. Share the entire
// calculator so its cache, coalescing and two-worker budget are process-wide.
const calculatorKey = Symbol.for('datetime.holiday-calculator.v1')
const processState = globalThis as typeof globalThis & {
  [calculatorKey]?: ReturnType<typeof createHolidayCalculator>
}
export const getHolidays = processState[calculatorKey] ??= createHolidayCalculator({run: query => {
  const modulePath = createRequire(join(process.cwd(), 'package.json')).resolve('date-holidays')
  return run({modulePath, query})
}})
