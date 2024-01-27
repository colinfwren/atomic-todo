import {getListMapFromTodos} from "./getListMapFromTodos";
import {TodoItemList, TodoListRow} from "../types";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {day1List, day2List, day3List, testTodoItemListMap, testTodos} from "../testData";


const boardStartDate = new Date(2023, 10, 13, 0, 0 ,0)
const currentDate = new Date(2023, 10, 13, 0,0,0)

describe('getListMapFromTodos', () => {
  it('returns a TodoListMap for the defaultRow layout when no rows defined', () => {
    const result = getListMapFromTodos(boardStartDate, currentDate, testTodos)
    expect(result).toEqual(testTodoItemListMap)
  })
  it('returns a TodoListMap for the defined row layout', () => {
    const rows: TodoListRow[] = [
      { granularity: TodoLevel.Day, deltas: [0, 1, 2]}
    ]
    const result = getListMapFromTodos(boardStartDate, currentDate, testTodos, rows)
    const expectedResult = new Map<string, TodoItemList>([
      [day1List.id, day1List],
      [day2List.id, day2List],
      [day3List.id, day3List],
    ])
    expect(result).toEqual(expectedResult)
  })
})