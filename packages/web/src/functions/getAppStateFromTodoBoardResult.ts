import {TodoBoardResult, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoBoardState} from "../types";
import {getListMapFromTodos} from "./getListMapFromTodos";
import {getTodoMapFromTodos} from "./getTodoMapFromTodos";

/**
 * Get AppState object from TodoBoardResult response from server
 *
 * @param {TodoBoardResult} response - Response from server
 * @returns {TodoBoardState} The state for the app
 */
export function getAppStateFromTodoBoardResult({ board, todos}: TodoBoardResult): TodoBoardState {
    const boardStartDate = new Date(board.startDate * 1000)
    const lists = getListMapFromTodos(boardStartDate, todos)
    const todoMap = getTodoMapFromTodos(todos)
    return {
      board: {
        ...board,
        startDate: boardStartDate,
        months: [ ...lists.keys()].filter((key) => key.split('-')[0] === TodoLevel.Month).sort(),
        weeks: [...lists.keys()].filter((key) => key.split('-')[0] === TodoLevel.Week).sort(),
        days: [...lists.keys()].filter((key) => key.split('-')[0] === TodoLevel.Day).sort()
      },
      lists,
      todos: todoMap
    }
}