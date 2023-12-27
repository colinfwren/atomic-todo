import { TodoLevel } from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Calculate the end date for the list based on the granularity
 *
 * @param {Date} listStartDate - The start date for the list
 * @param {TodoLevel} granularity - The granularity the list represents
 */
export function getEndDateForList(listStartDate: Date, granularity: TodoLevel): Date {
  const listEndDate = new Date(listStartDate)
  switch (granularity) {
    case TodoLevel.Day:
      listEndDate.setDate(listEndDate.getDate() + 1)
      break;
    case TodoLevel.Week:
      listEndDate.setDate(listEndDate.getDate() + 7)
      break;
    case TodoLevel.Month:
      listEndDate.setMonth(listEndDate.getMonth() + 1)
      break;
  }
  return listEndDate
}