import {Todo, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoItemList, TodoListMap, TodoListRow} from "../types";
import {getStartDateForList} from "./getStartDateForList";
import {getEndDateForList} from "./getEndDateForList";
import {getTodosForGranularity} from "./getTodosForGranularity";
import {getListEra} from "./getListEra";

const DAY_DELTAS = [0, 1, 2, 3, 4, 5, 6]
const WEEK_MONTH_DELTAS = [0, 1, 2, 3, 4, 5]

const defaultRows: TodoListRow[] = [
  { granularity: TodoLevel.Day, deltas: DAY_DELTAS },
  { granularity: TodoLevel.Week, deltas: WEEK_MONTH_DELTAS },
  { granularity: TodoLevel.Month, deltas: WEEK_MONTH_DELTAS }
]

/**
 * Create Map of list Ids and Todo List from list of Todos
 *
 * @param {Date} boardStartDate - Start date of the board
 * @param {Date} currentDate - The current date
 * @param {Todo[]} todos - List of Todos from GraphQL response
 * @param {TodoListRow[]} rows - List of rows to create Todo Lists for
 * @returns {TodoListMap} Map of list IDs and TodoItemList objects
 */
export function getListMapFromTodos(boardStartDate: Date, currentDate: Date, todos: Todo[], rows: TodoListRow[] = defaultRows): TodoListMap {
  return new Map<string, TodoItemList>(rows.flatMap(({ granularity, deltas }) => {
    return deltas.map((delta) => {
      const listId = `${granularity}-${delta}`
      const listStartDate = getStartDateForList(boardStartDate, granularity, delta)
      const listEndDate = getEndDateForList(listStartDate, granularity)
      const todosForList = getTodosForGranularity(listStartDate, listEndDate, granularity, todos)
        .sort((todoA, todoB) => {
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

