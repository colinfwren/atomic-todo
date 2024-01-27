import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoListEra} from "../types";

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Determine if the list is in the past, future or current era
 *
 * @param {Date} currentDate - The current date of the user's client
 * @param {Date} startDate - The start date of the list
 * @param {TodoLevel} granularity - The granularity of the list
 * @returns {TodoListEra} IF the TodoList period represents the past, the future or the current period of time
 */
export function getListEra(currentDate: Date, startDate: Date, granularity: TodoLevel): TodoListEra {
  const dateDelta = Math.round((startDate.getTime() - currentDate.getTime()) / MS_PER_DAY)
  if (granularity === TodoLevel.Day) {
    if (dateDelta < 0) {
      return TodoListEra.past
    } else if (dateDelta === 0) {
      return TodoListEra.current
    }
  } else if (granularity === TodoLevel.Week) {
    if (dateDelta < -6) {
      return TodoListEra.past
    }
  } else {
    const monthDate = new Date(currentDate)
    monthDate.setDate(1)
    if ((startDate.getTime() - monthDate.getTime()) < 0) {
      return TodoListEra.past
    }
  }
  return TodoListEra.future
}