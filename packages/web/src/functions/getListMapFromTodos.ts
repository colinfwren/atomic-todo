import {Todo, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoItemList, TodoListEra, TodoListMap} from "../types";
import {getStartDateForList} from "./getStartDateForList";
import {getEndDateForList} from "./getEndDateForList";
import {getTodosForGranularity} from "../components/TodoItemList/TodoItemList";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_DELTAS = [0, 1, 2, 3, 4, 5, 6]
const WEEK_MONTH_DELTAS = [0, 1, 2, 3, 4, 5]

const rows = [
  { granularity: TodoLevel.Day, deltas: DAY_DELTAS },
  { granularity: TodoLevel.Week, deltas: WEEK_MONTH_DELTAS },
  { granularity: TodoLevel.Month, deltas: WEEK_MONTH_DELTAS }
]

/**
 * Determine if the list is in the past, future or current era
 *
 * @param {Date} currentDate - The current date of the user's client
 * @param {Date} startDate - The start date of the list
 * @param {TodoLevel} granularity - The granularity of the list
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

/**
 * Create Map of list Ids and Todo List from list of Todos
 *
 * @param {Date} boardStartDate - Start date of the board
 * @param {Todo[]} todos - List of Todos from GraphQL response
 * @returns {TodoListMap} Map of list IDs and TodoItemList objects
 */
export function getListMapFromTodos(boardStartDate: Date, todos: Todo[]): TodoListMap {
  const rawDate = new Date()
  const currentDate = new Date(rawDate.toISOString())
  currentDate.setHours(0, 0, 0, 0)
  return new Map<string, TodoItemList>(rows.flatMap(({ granularity, deltas }) => {
    return deltas.map((delta) => {
      const listId = `${granularity}-${delta}`
      const listStartDate = getStartDateForList(boardStartDate, granularity, delta)
      const listEndDate = getEndDateForList(listStartDate, granularity)
      const todosForList = getTodosForGranularity(listStartDate, listEndDate, granularity, todos).sort((todoA, todoB) => {
        switch (granularity) {
          case TodoLevel.Month:
            return todoA.posInMonth - todoB.posInMonth
          case TodoLevel.Week:
            return todoA.posInWeek - todoB.posInWeek
          case TodoLevel.Day:
            return todoA.posInDay - todoB.posInDay
        }
      })
      const list: TodoItemList = {
        id: listId,
        listStartDate,
        listEndDate,
        granularity,
        todos: todosForList.map((todo) => todo.id),
        era: getListEra(currentDate, listStartDate, granularity)
      }
      return [listId, list]
    })
  }))
}

