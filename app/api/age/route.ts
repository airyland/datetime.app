import { NextRequest, NextResponse } from "next/server"
import { calculateAge } from "@/lib/age-calculator"
import {
  formatDateWithOffset,
  formatUtcOffsetLabel,
  parseIsoDateWithOffset,
  parseUtcOffsetParam,
  startOfDayWithOffset,
} from "./date-utils"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const birthDateParam = searchParams.get("birthdate")
  const targetDateParam = searchParams.get("targetDate")
  const utcOffsetParam = searchParams.get("utcOffset")

  // Validate required parameters
  if (!birthDateParam) {
    return NextResponse.json(
      {
        error: "birthdate parameter is required",
        usage: "?birthdate=YYYY-MM-DD&targetDate=YYYY-MM-DD&utcOffset=±HH:MM (targetDate is optional, defaults to current date)"
      },
      { status: 400 }
    )
  }

  try {
    let utcOffsetMinutes: number
    try {
      utcOffsetMinutes = parseUtcOffsetParam(utcOffsetParam)
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Invalid utcOffset format. Use minutes from UTC or ±HH:MM."
        },
        { status: 400 }
      )
    }

    let birthDate: Date
    try {
      birthDate = parseIsoDateWithOffset(birthDateParam, utcOffsetMinutes)
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Invalid birthdate format. Use YYYY-MM-DD format (e.g., 1990-01-15)"
        },
        { status: 400 }
      )
    }

    let targetDate: Date
    let normalizedTargetDateParam: string

    if (targetDateParam) {
      try {
        targetDate = parseIsoDateWithOffset(targetDateParam, utcOffsetMinutes)
        normalizedTargetDateParam = targetDateParam
      } catch (error) {
        return NextResponse.json(
          {
            error: error instanceof Error ? error.message : "Invalid targetDate format. Use YYYY-MM-DD format (e.g., 2025-10-17)"
          },
          { status: 400 }
        )
      }
    } else {
      targetDate = startOfDayWithOffset(new Date(), utcOffsetMinutes)
      normalizedTargetDateParam = formatDateWithOffset(targetDate, utcOffsetMinutes)
    }

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid targetDate format. Use YYYY-MM-DD format (e.g., 2025-10-17)"
        },
        { status: 400 }
      )
    }

    // Check if birthdate is in the future relative to target date
    if (birthDate > targetDate) {
      return NextResponse.json(
        {
          error: "Birth date cannot be in the future relative to target date"
        },
        { status: 400 }
      )
    }

    // Calculate age
    const age = calculateAge(birthDate, targetDate)

    // Return age data
    return NextResponse.json({
      birthdate: birthDateParam,
      targetDate: normalizedTargetDateParam,
      utcOffset: {
        minutes: utcOffsetMinutes,
        label: formatUtcOffsetLabel(utcOffsetMinutes),
      },
      age: {
        years: age.years,
        months: age.months,
        days: age.days,
        totalDays: age.totalDays,
        totalMonths: age.totalMonths,
        decimalAge: age.decimalAge,
        formatted: age.formatted,
      }
    })
  } catch (error) {
    console.error("Error calculating age:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to calculate age"
      },
      { status: 500 }
    )
  }
}
