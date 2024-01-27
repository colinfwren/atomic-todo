/**
 * Get the number of hours to subtract from the current date to get to the first day of the week
 *
 * @param {Date} date - The date for the week
 * @returns {number} the number of hours to subtract from the supplied date to get to the first of the week
 */
export function getHoursToFirstDayOfWeek(date: Date): number {
  const day = date.getDay() || 7
  if (day !== 1) {
    return -24 * (day - 1)
  }
  return 0
}