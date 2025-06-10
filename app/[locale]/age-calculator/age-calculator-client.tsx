"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { JetBrains_Mono } from "next/font/google"
import { calculateAge, getNextBirthday } from "@/lib/age-calculator"
import { Clock, Calendar as CalendarIcon, Gift, Calculator } from "lucide-react"
import { format } from "date-fns"
import { useTranslations } from 'next-intl'

// Load JetBrains Mono for numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

interface AgeCalculatorClientProps {
  initialBirthDate?: Date
}

export default function AgeCalculatorClient({ initialBirthDate }: AgeCalculatorClientProps) {
  const t = useTranslations('ageCalculator')
  
  // Input method state
  const [inputMethod, setInputMethod] = useState<'calendar' | 'manual'>('calendar')

  // Birth date states
  const [birthDate, setBirthDate] = useState<Date | undefined>(initialBirthDate || undefined)
  const [birthYear, setBirthYear] = useState<string>("")
  const [birthMonth, setBirthMonth] = useState<string>("")
  const [birthDay, setBirthDay] = useState<string>("")

  // Target date states
  const [useCustomTargetDate, setUseCustomTargetDate] = useState(false)
  const [targetDate, setTargetDate] = useState<Date>(new Date())
  const [targetYear, setTargetYear] = useState<string>(new Date().getFullYear().toString())
  const [targetMonth, setTargetMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'))
  const [targetDay, setTargetDay] = useState<string>(new Date().getDate().toString().padStart(2, '0'))

  // Result states
  const [age, setAge] = useState<ReturnType<typeof calculateAge> | null>(null)
  const [nextBirthday, setNextBirthday] = useState<ReturnType<typeof getNextBirthday> | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [error, setError] = useState<string | null>(null)

  // Handle manual birth date input
  const handleManualBirthDateSubmit = () => {
    setError(null)

    try {
      // Validate inputs
      const year = parseInt(birthYear)
      const month = parseInt(birthMonth) - 1 // JavaScript months are 0-indexed
      const day = parseInt(birthDay)

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(t('errors.validNumbers'))
      }

      if (year < 1900 || year > new Date().getFullYear()) {
        throw new Error(t('errors.yearRange'))
      }

      if (month < 0 || month > 11) {
        throw new Error(t('errors.monthRange'))
      }

      if (day < 1 || day > 31) {
        throw new Error(t('errors.dayRange'))
      }

      const date = new Date(year, month, day)

      // Check if the date is valid (e.g., not February 30)
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(t('errors.invalidDate'))
      }

      // Check if the date is in the future
      if (date > new Date()) {
        throw new Error(t('errors.futureDate'))
      }

      setBirthDate(date)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('errors.unknownError'))
      }
    }
  }

  // Handle manual target date input
  const handleManualTargetDateSubmit = () => {
    setError(null)

    try {
      // Validate inputs
      const year = parseInt(targetYear)
      const month = parseInt(targetMonth) - 1 // JavaScript months are 0-indexed
      const day = parseInt(targetDay)

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(t('errors.validNumbers'))
      }

      if (month < 0 || month > 11) {
        throw new Error(t('errors.monthRange'))
      }

      if (day < 1 || day > 31) {
        throw new Error(t('errors.dayRange'))
      }

      const date = new Date(year, month, day)

      // Check if the date is valid (e.g., not February 30)
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(t('errors.invalidDate'))
      }

      setTargetDate(date)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(t('errors.unknownError'))
      }
    }
  }

  // Update age calculation when birth date or target date changes
  useEffect(() => {
    if (birthDate) {
      try {
        const calculatedAge = calculateAge(birthDate, useCustomTargetDate ? targetDate : currentTime)
        setAge(calculatedAge)

        const nextBday = getNextBirthday(birthDate)
        setNextBirthday(nextBday)
      } catch (error) {
        console.error("Error calculating age:", error)
        setAge(null)
        setNextBirthday(null)
      }
    } else {
      setAge(null)
      setNextBirthday(null)
    }
  }, [birthDate, currentTime, targetDate, useCustomTargetDate])

  // Update current time every second for real-time age (only when not using custom target date)
  useEffect(() => {
    if (!birthDate || useCustomTargetDate) return

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [birthDate, useCustomTargetDate])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{t('enterBirthDate')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <RadioGroup
                value={inputMethod}
                onValueChange={(value) => setInputMethod(value as 'calendar' | 'manual')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="calendar" id="calendar" />
                  <Label htmlFor="calendar">{t('inputMethods.calendar')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">{t('inputMethods.manual')}</Label>
                </div>
              </RadioGroup>
            </div>

            {inputMethod === 'calendar' ? (
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                disabled={(date) => date > new Date()}
                className="mx-auto"
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="birth-year">{t('labels.year')}</Label>
                    <Input
                      id="birth-year"
                      type="number"
                      placeholder="YYYY"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth-month">{t('labels.month')}</Label>
                    <Input
                      id="birth-month"
                      type="number"
                      placeholder="MM"
                      min="1"
                      max="12"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birth-day">{t('labels.day')}</Label>
                    <Input
                      id="birth-day"
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleManualBirthDateSubmit}
                  className="w-full"
                >
                  {t('labels.calculateAge')}
                </Button>

                {birthDate && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {t('labels.selectedDate')}: {birthDate.toLocaleDateString()}
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-500 mt-2">
                    {error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{t('calculateAgeAsOf')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="custom-date"
                checked={useCustomTargetDate}
                onCheckedChange={setUseCustomTargetDate}
              />
              <Label htmlFor="custom-date">{t('labels.useCustomDate')}</Label>
            </div>

            {useCustomTargetDate ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="target-year">{t('labels.year')}</Label>
                    <Input
                      id="target-year"
                      type="number"
                      placeholder="YYYY"
                      value={targetYear}
                      onChange={(e) => setTargetYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-month">{t('labels.month')}</Label>
                    <Input
                      id="target-month"
                      type="number"
                      placeholder="MM"
                      min="1"
                      max="12"
                      value={targetMonth}
                      onChange={(e) => setTargetMonth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-day">{t('labels.day')}</Label>
                    <Input
                      id="target-day"
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      value={targetDay}
                      onChange={(e) => setTargetDay(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleManualTargetDateSubmit}
                  className="w-full"
                >
                  {t('labels.updateTargetDate')}
                </Button>

                <div className="text-sm text-muted-foreground mt-2">
                  {t('labels.targetDate')}: {targetDate.toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md">
                <p className="text-lg font-medium mb-2">{t('labels.currentDateTime')}</p>
                <p className={`text-xl ${jetbrainsMono.className}`}>
                  {format(currentTime, "yyyy-MM-dd HH:mm:ss")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <Clock className="inline-block mr-1 h-3 w-3" />
                  <span>{t('labels.updatesInRealTime')}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {birthDate && age && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span>{t('ageResults')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="standard">{t('tabs.standard')}</TabsTrigger>
                <TabsTrigger value="detailed">{t('tabs.detailed')}</TabsTrigger>
                <TabsTrigger value="decimal">{t('tabs.decimal')}</TabsTrigger>
              </TabsList>

              <TabsContent value="standard" className="mt-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${jetbrainsMono.className}`}>
                    {age.years}<span className="text-muted-foreground text-xl">y</span> {age.months}<span className="text-muted-foreground text-xl">m</span> {age.days}<span className="text-muted-foreground text-xl">d</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">Age: {age.formatted.ymd}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {useCustomTargetDate
                      ? `As of ${targetDate.toLocaleDateString()}`
                      : "Updates in real-time"
                    }
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="mt-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded">
                      <div className="text-sm text-muted-foreground">{t('labels.years')}</div>
                      <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>{age.years}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-sm text-muted-foreground">{t('labels.months')}</div>
                      <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>{age.totalMonths}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-sm text-muted-foreground">{t('labels.days')}</div>
                      <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>{age.totalDays}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-sm text-muted-foreground">{t('labels.hours')}</div>
                      <div className={`text-2xl font-bold ${jetbrainsMono.className}`}>{age.totalDays * 24 + age.hours}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    {useCustomTargetDate
                      ? `As of ${targetDate.toLocaleDateString()}`
                      : (
                        <>
                          <Clock className="inline-block mr-1 h-3 w-3" />
                          <span>{t('labels.updatesInRealTime')}</span>
                        </>
                      )
                    }
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="decimal" className="mt-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${jetbrainsMono.className}`}>
                    {age.decimalAge}
                  </div>
                  <p className="mt-2 text-muted-foreground">{t('labels.yearsInDecimalFormat')}</p>
                </div>
              </TabsContent>
            </Tabs>

            {!useCustomTargetDate && nextBirthday && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t('labels.nextBirthday')}</span>
                </div>
                <p className="text-sm">
                  You will be <span className="font-bold">{nextBirthday.nextAge}</span> in{" "}
                  <span className="font-bold">{nextBirthday.daysUntil}</span> days
                  ({nextBirthday.date.toLocaleDateString()})
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
