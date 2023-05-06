import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoListTitle} from "../types";

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Get the name to show in the header of the TodoList based on the board start date and the start of the list
 *
 * @param {string} boardStartDate - Start date of the TodoBoard
 * @param {string} listStartDate - Start date of the TodoList
 * @param {TodoLevel} level - Level of the TodoList
 * @returns {string} the text to name to show in the header
 */
export function getTodoListName(boardStartDate: number, listStartDate: number, level: TodoLevel): TodoListTitle {
  const listDate = new Date(listStartDate)
  if (level === TodoLevel.Day) {
    return {
      name: weekdays[listDate.getDay()],
      date: listDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })
    }
  } else if (level === TodoLevel.Week) {
    const boardDate = new Date(boardStartDate)
    const weekDelta = Math.round(Math.round(listDate.getTime() - boardDate.getTime())/604800000)
    const weekTerm = weekDelta < 1 ? 'Week' : 'Weeks'
    return {
      name: `${weekDelta + 1} ${weekTerm}`,
      date: listDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })
    }
  }
  const boardDate = new Date(boardStartDate)
  const monthDelta = listDate.getMonth() - boardDate.getMonth()
  const monthTerm = monthDelta < 1 ? 'Month' : 'Months'
  return {
    name: `${monthDelta + 1} ${monthTerm}`,
    date: months[listDate.getMonth()]
  }
}