import { NextRequest, NextResponse } from 'next/server'
import { holidayQuerySchema } from '@/lib/holiday-query'
import { isIsolatedTaskError } from '@/lib/server/bounded-worker'
import { getHolidays } from '@/lib/server/holidays'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const parsed = holidayQuerySchema.safeParse(Object.fromEntries(params))
  if (!parsed.success || [...params.keys()].some(key => params.getAll(key).length !== 1)) {
    return NextResponse.json({ error: 'Invalid holiday query (years 1900–2100)' }, { status: 400 })
  }
  try {
    const holidays = await getHolidays(parsed.data)
    return NextResponse.json({ holidays })
  } catch (error) {
    if (isIsolatedTaskError(error) && error.code === 'INVALID_INPUT') {
      return NextResponse.json({error:'Unsupported country or region'}, {status:400})
    }
    return NextResponse.json({ error: 'Holiday calculation unavailable' }, {
      status: 503, headers: { 'Retry-After': '1', 'Cache-Control': 'no-store' },
    })
  }
}
