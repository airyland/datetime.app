// Calendar utility functions

export interface CalendarMonth {
  month: number;
  year: number;
  name: string;
  shortName: string;
  days: CalendarDay[];
  startDay: number; // Day of week the month starts (0 = Sunday)
  totalDays: number;
}

export interface CalendarDay {
  date: number;
  dayOfWeek: number; // 0 = Sunday
  isToday: boolean;
  isOtherMonth: boolean;
  weekNumber: number;
  fullDate: Date;
}

export interface YearCalendar {
  year: number;
  months: CalendarMonth[];
  isLeapYear: boolean;
  totalDays: number;
  daysPassed?: number;
  daysRemaining?: number;
  weeksPassed?: number;
  weeksRemaining?: number;
}

/**
 * Get week number according to ISO 8601
 * Week 1 is the first week with at least 4 days in the new year
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get month names in specified locale
 */
export function getMonthNames(locale: string = 'en'): { full: string[], short: string[] } {
  const full = [];
  const short = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(2000, i, 1);
    full.push(date.toLocaleDateString(locale, { month: 'long' }));
    short.push(date.toLocaleDateString(locale, { month: 'short' }));
  }
  
  return { full, short };
}

/**
 * Get weekday names in specified locale
 */
export function getWeekdayNames(locale: string = 'en'): { full: string[], short: string[] } {
  const full = [];
  const short = [];
  
  // Start from Sunday (day 4 of week starting Monday Jan 4, 2000)
  for (let i = 0; i < 7; i++) {
    const date = new Date(2000, 0, 2 + i); // Jan 2, 2000 was a Sunday
    full.push(date.toLocaleDateString(locale, { weekday: 'long' }));
    short.push(date.toLocaleDateString(locale, { weekday: 'short' }));
  }
  
  return { full, short };
}

/**
 * Generate calendar for a specific month
 */
export function generateMonth(year: number, month: number, monthNames: string[], monthNamesShort: string[]): CalendarMonth {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay(); // 0 = Sunday
  const totalDays = lastDay.getDate();
  
  const days: CalendarDay[] = [];
  
  // Add previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
  
  for (let i = startDay - 1; i >= 0; i--) {
    const date = prevMonthDays - i;
    const fullDate = new Date(prevYear, prevMonth, date);
    days.push({
      date,
      dayOfWeek: (startDay - 1 - i) % 7,
      isToday: false,
      isOtherMonth: true,
      weekNumber: getWeekNumber(fullDate),
      fullDate
    });
  }
  
  // Add current month's days
  for (let date = 1; date <= totalDays; date++) {
    const fullDate = new Date(year, month, date);
    const dayOfWeek = fullDate.getDay();
    days.push({
      date,
      dayOfWeek,
      isToday: isCurrentMonth && date === todayDate,
      isOtherMonth: false,
      weekNumber: getWeekNumber(fullDate),
      fullDate
    });
  }
  
  // Add next month's leading days to complete the grid (6 weeks = 42 days)
  const remainingDays = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = new Date(nextYear, nextMonth, date);
    const dayOfWeek = fullDate.getDay();
    days.push({
      date,
      dayOfWeek,
      isToday: false,
      isOtherMonth: true,
      weekNumber: getWeekNumber(fullDate),
      fullDate
    });
  }
  
  return {
    month,
    year,
    name: monthNames[month],
    shortName: monthNamesShort[month],
    days,
    startDay,
    totalDays
  };
}

/**
 * Generate single month calendar with larger view
 */
export function generateMonthCalendar(year: number, month: number, locale: string = 'en'): CalendarMonth {
  const monthNames = getMonthNames(locale);
  return generateMonth(year, month, monthNames.full, monthNames.short);
}

/**
 * Generate full year calendar
 */
export function generateYearCalendar(year: number, locale: string = 'en'): YearCalendar {
  const monthNames = getMonthNames(locale);
  const months: CalendarMonth[] = [];
  
  for (let month = 0; month < 12; month++) {
    months.push(generateMonth(year, month, monthNames.full, monthNames.short));
  }
  
  const leap = isLeapYear(year);
  const totalDays = leap ? 366 : 365;
  
  // Calculate progress if it's current year
  const today = new Date();
  const currentYear = today.getFullYear();
  let daysPassed, daysRemaining, weeksPassed, weeksRemaining;
  
  if (year === currentYear) {
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    daysPassed = dayOfYear;
    daysRemaining = totalDays - daysPassed;
    weeksPassed = Math.floor(daysPassed / 7);
    weeksRemaining = Math.ceil(daysRemaining / 7);
  }
  
  return {
    year,
    months,
    isLeapYear: leap,
    totalDays,
    daysPassed,
    daysRemaining,
    weeksPassed,
    weeksRemaining
  };
}