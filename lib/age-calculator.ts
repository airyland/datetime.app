/**
 * Calculate age from birthdate to current date or specified date
 * @param birthDate Birth date
 * @param toDate Date to calculate age to (defaults to current date)
 * @returns Object with age in different formats
 */
export function calculateAge(birthDate: Date, toDate: Date = new Date()) {
  if (birthDate > toDate) {
    throw new Error("Birth date cannot be in the future");
  }

  const birthYear = birthDate.getUTCFullYear();
  const birthMonth = birthDate.getUTCMonth();
  const birthDay = birthDate.getUTCDate();

  const targetYear = toDate.getUTCFullYear();
  const targetMonth = toDate.getUTCMonth();
  const targetDay = toDate.getUTCDate();

  let years = targetYear - birthYear;

  if (targetMonth < birthMonth || (targetMonth === birthMonth && targetDay < birthDay)) {
    years--;
  }

  let months = targetMonth - birthMonth;
  if (months < 0) {
    months += 12;
  }

  if (targetDay < birthDay) {
    months--;
    if (months < 0) {
      months += 12;
    }
  }

  let days = targetDay - birthDay;
  if (days < 0) {
    const lastMonth = new Date(Date.UTC(targetYear, targetMonth, 0));
    days += lastMonth.getUTCDate();
  }

  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const totalMilliseconds = toDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(totalMilliseconds / millisecondsInDay);
  const totalMonths = years * 12 + months;
  const normalizedRemainder = ((totalMilliseconds % millisecondsInDay) + millisecondsInDay) % millisecondsInDay;

  const hours = Math.floor(normalizedRemainder / (60 * 60 * 1000));
  const minutes = Math.floor((normalizedRemainder % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((normalizedRemainder % (60 * 1000)) / 1000);

  const decimalAge = totalDays / 365.25;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalMonths,
    decimalAge: parseFloat(decimalAge.toFixed(2)),
    formatted: {
      readable: `${years} years and ${months} months`,
      full: `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
      short: `${years}y ${months}m ${days}d`,
      ymd: `${years} years, ${months} months, ${days} days`,
      decimal: `${decimalAge.toFixed(2)} years`
    }
  };
}

/**
 * Get next birthday information
 * @param birthDate Birth date
 * @returns Object with next birthday information
 */
export function getNextBirthday(birthDate: Date) {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Create date for this year's birthday
  const thisBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  // If this year's birthday has passed, use next year
  if (today > thisBirthday) {
    thisBirthday.setFullYear(currentYear + 1);
  }
  
  // Calculate days until next birthday
  const daysUntil = Math.ceil((thisBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate age on next birthday
  const nextAge = thisBirthday.getFullYear() - birthDate.getFullYear();
  
  return {
    date: thisBirthday,
    daysUntil,
    nextAge
  };
}
