import {getTodoBoard} from "./getDocs";
import {TODOLIST_COL_ID} from "../consts";
import {TodoBoardDoc, TodoDoc, TodoListDoc} from "../types";
import {docAttrs, errorMessage, board} from "./testCommon";
import {Todo, TodoLevel, TodoList} from "../generated/graphql";

const badBoardId = 'BOOM'
const badListsBoardId = 'LIST-BOOM'
const badTodosBoardId = 'TODO-BOOM'

const badListsBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Bad Board',
  startDate: '',
  id: docAttrs.$id,
  days: ['bad_lists'],
  weeks: [],
  months: []
}

const badTodosBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Bad Board',
  startDate: '',
  id: docAttrs.$id,
  days: ['bad_todos'],
  weeks: [],
  months: []
}

const badTodosListDoc: TodoListDoc = {
  ...docAttrs,
  id: docAttrs.$id,
  childLists: [],
  parentList: '',
  level: TodoLevel.Day,
  startDate: '',
  todos: ['bad_todos']
}

const boardDoc: TodoBoardDoc = {
  ...docAttrs,
  ...board
}

const list: TodoList = {
  id: docAttrs.$id,
  childLists: [],
  parentList: '',
  level: TodoLevel.Day,
  startDate: '',
  todos: ['good_todos']
}

const listDoc: TodoListDoc = {
  ...docAttrs,
  ...list
}

const todo: Todo = {
  name: 'Good Todo',
  completed: true,
  id: docAttrs.$id
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
      case badListsBoardId:
        return badListsBoardDoc
      case badTodosBoardId:
        return badTodosBoardDoc
      default:
        return boardDoc
    }
  }),
  listDocuments: jest.fn().mockImplementation((databaseId, collectionId, query: string[]) => {
    if (collectionId === TODOLIST_COL_ID) {
      switch (query[0]) {
        case 'equal("$id", ["bad_lists"])':
          throw new Error('no lists')
        case 'equal("$id", ["bad_todos"])':
          return { total: 1, documents: [badTodosListDoc]}
        default:
          return { total: 1, documents: [listDoc]}
      }
    }
    if (query[0] === 'equal("$id", ["bad_todos"])') throw new Error('no todos')
    return { total: 1, documents: [todoDoc]}
  })
} as any

describe('Getting data for a TodoBoard', () => {
  it('throws an error if unable to load the TodoBoard', async () => {
    await expect(getTodoBoard(mockDatabases, badBoardId)).rejects.toThrowError(errorMessage)
  })
  it('throws an error if unable to load a TodoList', async () => {
    await expect(getTodoBoard(mockDatabases, badListsBoardId)).rejects.toThrowError('no lists')
  })
  it('throws an error if unable to load a Todo', async () => {
    await expect(getTodoBoard(mockDatabases, badTodosBoardId)).rejects.toThrowError('no todos')
  })
  it('returns a TodoBoard and the TodoLists & Todos referenced in it', async () => {
    const expectedResult = {
      board,
      lists: [list],
      todos: [todo]
    }
    const result = await getTodoBoard(mockDatabases, 'good')
    expect(result).toEqual(expectedResult)
  })
})