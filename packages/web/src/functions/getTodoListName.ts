import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

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
export function getTodoListName(boardStartDate: string, listStartDate: string, level: TodoLevel): string {
  const listDate = new Date(listStartDate)
  if (level === TodoLevel.Day) {
    return `${weekdays[listDate.getDay()]} (${listDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })})`
  } else if (level === TodoLevel.Week) {
    const boardDate = new Date(boardStartDate)
    const weekDelta = Math.round(Math.round(listDate.getTime() - boardDate.getTime())/604800000)
    const weekTerm = weekDelta < 1 ? 'Week' : 'Weeks'
    return `${weekDelta + 1} ${weekTerm} (${listDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })})`
  }
  const boardDate = new Date(boardStartDate)
  const monthDelta = listDate.getMonth() - boardDate.getMonth()
  const monthTerm = monthDelta < 1 ? 'Month' : 'Months'
  return `${monthDelta + 1} ${monthTerm} (${months[listDate.getMonth()]})`
}