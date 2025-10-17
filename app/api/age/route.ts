import { NextRequest, NextResponse } from "next/server"
import { calculateAge } from "@/lib/age-calculator"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const birthDateParam = searchParams.get("birthdate")
  const targetDateParam = searchParams.get("targetDate")

  // Validate required parameters
  if (!birthDateParam) {
    return NextResponse.json(
      {
        error: "birthdate parameter is required",
        usage: "?birthdate=YYYY-MM-DD&targetDate=YYYY-MM-DD (targetDate is optional, defaults to current date)"
      },
      { status: 400 }
    )
  }

  try {
    // Parse birthdate
    const birthDate = new Date(birthDateParam)

    // Validate birthdate
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid birthdate format. Use YYYY-MM-DD format (e.g., 1990-01-15)"
        },
        { status: 400 }
      )
    }

    // Parse target date (optional)
    let targetDate = new Date()
    if (targetDateParam) {
      targetDate = new Date(targetDateParam)

      // Validate target date
      if (isNaN(targetDate.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid targetDate format. Use YYYY-MM-DD format (e.g., 2025-10-17)"
          },
          { status: 400 }
        )
      }
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
      targetDate: targetDateParam || targetDate.toISOString().split('T')[0],
      age: {
        years: age.years,
        months: age.months,
        days: age.days,
        totalDays: age.totalDays,
        totalMonths: age.totalMonths,
        decimalAge: age.decimalAge,
        formatted: {
          // Primary format requested by the user
          readable: `${age.years} years and ${age.months} months`,
          full: age.formatted.full,
          short: age.formatted.short,
          ymd: age.formatted.ymd,
          decimal: age.formatted.decimal
        }
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
