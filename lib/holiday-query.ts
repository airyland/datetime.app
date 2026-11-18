import { z } from 'zod'

export const MIN_HOLIDAY_YEAR = 1900
export const MAX_HOLIDAY_YEAR = 2100
export const holidayYearSchema = z.number().int().min(MIN_HOLIDAY_YEAR).max(MAX_HOLIDAY_YEAR)
const yearText = z.string().length(4).regex(/^\d{4}$/).transform(Number).pipe(holidayYearSchema)
export const holidayCalculationSchema = z.object({
  country: z.string().length(2).regex(/^[A-Za-z]{2}$/).transform(value => value.toUpperCase()),
  year: holidayYearSchema,
  language: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/).max(16).default('en'),
  region: z.string().regex(/^[A-Za-z0-9]{1,8}(?:-[A-Za-z0-9]{1,8})?$/).max(16).transform(value => value.toUpperCase()).optional(),
}).strict()
export const holidayQuerySchema = holidayCalculationSchema.extend({
  year: yearText.optional().transform(value => value ?? new Date().getFullYear()).pipe(holidayYearSchema),
})
export type HolidayQuery = z.infer<typeof holidayQuerySchema>
