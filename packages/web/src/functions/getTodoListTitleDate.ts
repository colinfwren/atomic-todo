import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Create a string that represents the date of the list's start date
 *
 * @param {TodoLevel} granularity - The granularity of time the list represents
 * @param {Date} listStartDate - The date the list starts on
 * @returns {string} string for date
 */
export function getTodoListTitleDate(listStartDate: Date, granularity: TodoLevel): string {
  switch (granularity) {
    case TodoLevel.Day:
    case TodoLevel.Week:
       return `${String(listStartDate.getDate()).padStart(2, '0')}/${String(listStartDate.getMonth() + 1).padStart(2, '0')}`
    case TodoLevel.Month:
      return monthNames[listStartDate.getMonth()]
  }

}