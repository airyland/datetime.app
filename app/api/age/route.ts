import { NextRequest, NextResponse } from "next/server"
import { ageBetween, formatOffset, formatYmd, parseUtcOffset, parseYmd, todayAt } from "./age-utils"

const USAGE = "?birthdate=YYYY-MM-DD[&targetDate=YYYY-MM-DD][&utcOffset=±HH:MM]"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const birthdate = q.get("birthdate")
  if (!birthdate) {
    return NextResponse.json({ error: "birthdate parameter is required", usage: USAGE }, { status: 400 })
  }

  try {
    const offset = parseUtcOffset(q.get("utcOffset"))
    const birth = parseYmd(birthdate)
    const targetParam = q.get("targetDate")
    const target = targetParam ? parseYmd(targetParam) : todayAt(offset)
    const age = ageBetween(birth, target)

    return NextResponse.json(
      {
        birthdate: formatYmd(birth),
        targetDate: formatYmd(target),
        utcOffset: { minutes: offset, label: formatOffset(offset) },
        age,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } },
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request", usage: USAGE },
      { status: 400 },
    )
  }
}
