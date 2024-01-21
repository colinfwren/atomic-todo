import {board, docAttrs, errorMessage, TODO_END_DATE, TODO_START_DATE} from "./testCommon";
import {getTodoBoards} from "./getTodoBoards";
import {Todo} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc} from "../types";
import {TestType} from "@atomic-todo/test-reporter";

const todo: Todo = {
  name: 'Good Todo',
  completed: true,
  id: docAttrs.$id,
  deleted: false,
  startDate: TODO_START_DATE,
  endDate: TODO_END_DATE,
  showInYear: true,
  showInMonth: true,
  showInWeek: true,
  posInYear: 0,
  posInMonth: 0,
  posInWeek: 0,
  posInDay: 0
}

const todoDoc: TodoDoc = {
  ...docAttrs,
  ...todo
}

const boardDoc: TodoBoardDoc = {
  ...docAttrs,
  ...board,
  startDate: TODO_START_DATE,
  todos: [todoDoc]
}

describe('Getting list of TodoBoards for user', () => {
  it('throws an error if unable to load the TodoBoards', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0013',
      testType: TestType.UNIT
    })
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        throw new Error(errorMessage)
      })
    } as any
    await expect(getTodoBoards(databases)).rejects.toThrowError(errorMessage)
  })
  it('returns a list of TodoBoards', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0012',
      testType: TestType.UNIT
    })
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        return { total: 1, documents: [boardDoc]}
      })
    } as any
    const expectedResult = [
      {
        ...board,
        startDate: TODO_START_DATE
      }
    ]
    const result = await getTodoBoards(databases)
    expect(result).toEqual(expectedResult)
  })
})