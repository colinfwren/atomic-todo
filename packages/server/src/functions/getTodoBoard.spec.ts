import { getTodoBoard } from "./getTodoBoard";
import {TodoBoardDoc, TodoDoc} from "../types";
import {docAttrs, errorMessage, board, TODO_START_DATE, TODO_END_DATE} from "./testCommon";
import {Todo} from "../generated/graphql";
import {TestType} from "@atomic-todo/test-reporter";

const badBoardId = 'BOOM'
const badTodosBoardId = 'TODO-BOOM'
const badBoardStartDate = 568944000

const badTodosBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Bad Board',
  startDate: badBoardStartDate,
  id: docAttrs.$id,
  todos: []
}

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

describe('Getting data for a TodoBoard', () => {
  it('throws an error if unable to load the TodoBoard', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0005',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        throw new Error(errorMessage)
      })
    } as any
    await expect(getTodoBoard(databases, badBoardId)).rejects.toThrowError(errorMessage)
  })
  it('returns a TodoBoard and empty Todo array when no Todos in board date range', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0003',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return badTodosBoardDoc
      })
    } as any
    const expectedResult = {
      board: {
        ...board,
        name: 'Bad Board',
        startDate: badBoardStartDate
      },
      todos: []
    }
    const result = await getTodoBoard(databases, badTodosBoardId)
    expect(result).toEqual(expectedResult)
  })
  it('returns a TodoBoard and Todos that fall with board date range', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0003',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return boardDoc
      })
    } as any
    const expectedResult = {
      board: {
        ...board,
        startDate: TODO_START_DATE
      },
      todos: [todo]
    }
    const result = await getTodoBoard(databases, 'good')
    expect(result).toEqual(expectedResult)
  })
})