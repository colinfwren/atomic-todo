import { TodoLevel } from "@atomic-todo/server/dist/src/generated/graphql";
import { getHoursToFirstDayOfWeek } from "./getHoursForFirstDayOfWeek";

/**
 * Calculate the start date for the list based on the granularity and the delta to be applied
 *
 * @param {Date} boardStartDate - The start date for the board
 * @param {TodoLevel} granularity - The granularity the list represents
 * @param {number} delta - The relative date delta to apply based on the granularity
 */
export function getStartDateForList(boardStartDate: Date, granularity: TodoLevel, delta: number): Date {
  const listStartDate = new Date(boardStartDate)
  listStartDate.setHours(getHoursToFirstDayOfWeek(listStartDate))
  switch (granularity) {
    case TodoLevel.Day:
      listStartDate.setDate(listStartDate.getDate() + delta)
      break;
    case TodoLevel.Week:
      listStartDate.setDate(listStartDate.getDate() + (delta * 7))
      break;
    case TodoLevel.Month:
      listStartDate.setDate(1)
      listStartDate.setMonth(listStartDate.getMonth() + delta)
      break;
  }
  return listStartDate
}