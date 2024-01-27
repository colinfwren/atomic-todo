import {Todo, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Get the Todos to display for the specified granularity
 *
 * @param {Date} listStartDate - The start date of the list
 * @param {Date} listEndDate - The end date of the list
 * @param {TodoLevel} granularity - The granularity to get the Todos for
 * @param {Todo[]} todos - The list of Todos to filter
 * @returns {Todo[]} - Filtered list of Todos for granularity
 */
export function getTodosForGranularity(listStartDate: Date, listEndDate: Date, granularity: TodoLevel, todos: Todo[]): Todo[] {
  return todos.filter(({ startDate, endDate, showInWeek, showInMonth }) => {
    const todoStartDate = new Date(startDate * 1000)
    const todoEndDate = new Date(endDate * 1000)
    switch(granularity) {
      case TodoLevel.Day:
        return todoStartDate >= listStartDate && todoEndDate <= listEndDate
      case TodoLevel.Week:
        return showInWeek && todoStartDate >= listStartDate && todoEndDate <= listEndDate
      case TodoLevel.Month:
        return showInMonth && todoStartDate.getFullYear() === listStartDate.getFullYear() && todoStartDate.getMonth() === listStartDate.getMonth()
    }
  })
}