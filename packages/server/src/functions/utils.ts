export function convertDateToUTC(date: Date): Date {
    return new Date(`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T00:00:00.000Z`)
}

export function getHoursToFirstDayOfWeek(date: Date): number {
  const day = date.getDay() || 7
  if (day !== 1) {
    return -24 * (day - 1)
  }
  return 0
}