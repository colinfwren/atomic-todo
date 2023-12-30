import {getTodoBoard} from "./getDocs";
import {TodoBoardDoc, TodoDoc} from "../types";
import {docAttrs, errorMessage, board, TODO_START_DATE, TODO_END_DATE} from "./testCommon";
import {Todo} from "../generated/graphql";

const badBoardId = 'BOOM'
const badTodosBoardId = 'TODO-BOOM'
const badBoardStartDate = 568944000
const badBoardQueryStartDate = 567993600
const badBoardQueryEndDate = 583714800

const badTodosBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Bad Board',
  startDate: badBoardStartDate,
  id: docAttrs.$id,
  todos: []
}

const boardDoc: TodoBoardDoc = {
  ...docAttrs,
  ...board,
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

const mockDatabases = {
  getDocument: jest.fn().mockImplementation((databaseId, collectionId, docId) => {
    switch (docId) {
      case badBoardId:
        throw new Error(errorMessage)
      case badTodosBoardId:
        return badTodosBoardDoc
      default:
        return boardDoc
    }
  }),
  listDocuments: jest.fn().mockImplementation((databaseId, collectionId, query: string[]) => {
    if (query[0] === `between("startDate", ${badBoardQueryStartDate}, ${badBoardQueryEndDate})`) {
      return { total: 0, documents: []}
    }
    return { total: 1, documents: [todoDoc]}
  })
} as any

describe('Getting data for a TodoBoard', () => {
  it('throws an error if unable to load the TodoBoard', async () => {
    await expect(getTodoBoard(mockDatabases, badBoardId)).rejects.toThrowError(errorMessage)
  })
  it('returns a TodoBoard and empty Todo array when no Todos in board date range', async () => {
    const expectedResult = {
      board: {
        ...board,
        name: 'Bad Board',
        startDate: badBoardStartDate
      },
      todos: []
    }
    const result = await getTodoBoard(mockDatabases, badTodosBoardId)
    expect(result).toEqual(expectedResult)
  })
  it('returns a TodoBoard and Todos that fall with board date range', async () => {
    const expectedResult = {
      board,
      todos: [todo]
    }
    const result = await getTodoBoard(mockDatabases, 'good')
    expect(result).toEqual(expectedResult)
  })
})