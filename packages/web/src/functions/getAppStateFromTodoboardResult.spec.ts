import {testTodoItemListMap, testTodoMap, testTodos, todoBoard} from "../testData";
import {TodoBoardResult} from "@atomic-todo/server/dist/src/generated/graphql";
import {getAppStateFromTodoBoardResult} from "./getAppStateFromTodoBoardResult";
import {TodoBoardState} from "../types";

describe('getAppStateFromTodoboardResult', () => {
  it('returns the board, a map of todos and a map of todo lists based on the board start date and the todos', () => {
    const currentDate = new Date(2023, 10, 13, 0, 0,0)
    const todoboardResult: TodoBoardResult = {
      board: {
        ...todoBoard,
        startDate: currentDate.getTime() / 1000
      },
      todos: testTodos
    }
    const result = getAppStateFromTodoBoardResult(todoboardResult, currentDate)
    const expectedResult: TodoBoardState = {
      board: {
        ...todoBoard,
        startDate: currentDate,
        months: [0, 1, 2, 3, 4, 5].map((delta) => `month-${delta}`),
        weeks: [0, 1, 2, 3, 4, 5].map((delta) => `week-${delta}`),
        days: [0, 1, 2, 3, 4, 5, 6].map((delta) => `day-${delta}`)
      },
      lists: testTodoItemListMap,
      todos: testTodoMap
    }
    expect(result).toEqual(expectedResult)
  })
})