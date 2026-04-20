import assert from 'node:assert/strict'

import { calculateAge } from '../lib/age-calculator'
import {
  formatDateWithOffset,
  formatUtcOffsetLabel,
  parseIsoDateWithOffset,
  parseUtcOffsetParam,
  startOfDayWithOffset,
} from '../app/api/age/date-utils'

interface TestCase {
  name: string
  fn: () => void | Promise<void>
}

const tests: TestCase[] = []

function test(name: string, fn: () => void | Promise<void>) {
  tests.push({ name, fn })
}

function runCalculateAgeTests() {
  test('calculateAge returns zero age for identical dates', () => {
    const birth = new Date(Date.UTC(2020, 0, 1))
    const target = new Date(Date.UTC(2020, 0, 1))

    const age = calculateAge(birth, target)

    assert.equal(age.years, 0)
    assert.equal(age.months, 0)
    assert.equal(age.days, 0)
    assert.equal(age.formatted.readable, '0 years and 0 months')
  })

  test('calculateAge handles leap year birthdays', () => {
    const birth = new Date(Date.UTC(2000, 1, 29))
    const target = new Date(Date.UTC(2024, 1, 29))

    const age = calculateAge(birth, target)

    assert.equal(age.years, 24)
    assert.equal(age.months, 0)
    assert.equal(age.days, 0)
  })

  test('calculateAge throws when birth date is in the future', () => {
    const birth = new Date(Date.UTC(2030, 0, 1))
    const target = new Date(Date.UTC(2029, 11, 31))

    assert.throws(() => calculateAge(birth, target), {
      message: 'Birth date cannot be in the future',
    })
  })
}

function runDateUtilTests() {
  test('parseUtcOffsetParam parses hours and minutes', () => {
    assert.equal(parseUtcOffsetParam('-5'), -300)
    assert.equal(parseUtcOffsetParam('+05:30'), 330)
    assert.equal(parseUtcOffsetParam('45'), 45)
  })

  test('parseUtcOffsetParam rejects invalid offsets', () => {
    assert.throws(() => parseUtcOffsetParam('foo'), /Invalid utcOffset format/)
    assert.throws(() => parseUtcOffsetParam('15:61'), /Invalid utcOffset format/)
  })

  test('parseIsoDateWithOffset normalizes to UTC', () => {
    const parsed = parseIsoDateWithOffset('2024-01-15', -300)
    assert.equal(parsed.toISOString(), '2024-01-15T05:00:00.000Z')
  })

  test('parseIsoDateWithOffset rejects invalid calendar dates', () => {
    assert.throws(() => parseIsoDateWithOffset('2024-02-30', 0), /Invalid date format/)
  })

  test('startOfDayWithOffset returns midnight in offset', () => {
    const base = new Date('2024-01-15T12:34:56.000Z')
    const start = startOfDayWithOffset(base, 330)
    assert.equal(start.toISOString(), '2024-01-14T18:30:00.000Z')
  })

  test('format helpers produce expected values', () => {
    const date = new Date('2024-01-15T05:00:00.000Z')
    assert.equal(formatDateWithOffset(date, -300), '2024-01-15')
    assert.equal(formatUtcOffsetLabel(-300), '-05:00')
    assert.equal(formatUtcOffsetLabel(330), '+05:30')
  })
}

async function run() {
  runCalculateAgeTests()
  runDateUtilTests()

  let failed = 0

  for (const { name, fn } of tests) {
    try {
      await fn()
      console.log(`✓ ${name}`)
    } catch (error) {
      failed++
      console.error(`✖ ${name}`)
      console.error(error)
    }
  }

  if (failed > 0) {
    process.exitCode = 1
    console.error(`\n${failed} test(s) failed.`)
  } else {
    console.log(`\nAll ${tests.length} tests passed.`)
  }
}

run().catch((error) => {
  console.error('Unexpected error while running tests:', error)
  process.exit(1)
})
