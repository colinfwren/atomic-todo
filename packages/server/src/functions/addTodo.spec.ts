import {CREATE_APPWRITE_DOCUMENT_ERROR} from "./progressBoard";
import {addTodo} from "./addTodo";
import {
  docAttrs,
  board,
  TODO_ID,
  BOARD_ID,
  TODO_START_DATE,
  TODO_END_DATE
} from "./testCommon";

describe('Creating a new Todo', () => {
  it('throws an error when unable to create new todo', () => {
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(CREATE_APPWRITE_DOCUMENT_ERROR)
      })
    } as any
    expect(() => addTodo(databases, BOARD_ID, TODO_START_DATE, TODO_END_DATE, [])).rejects.toThrowError(CREATE_APPWRITE_DOCUMENT_ERROR)
  })
  it('returns updated board with todo in the appropriate TodoLists', async () => {
    const expectedResult = {
      board,
      todos: []
    }
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          $id: TODO_ID,
          id: TODO_ID,
          completed: false,
          name: 'New Todo',
          startDate: TODO_START_DATE,
          endDate: TODO_END_DATE,
          showInYear: true,
          showInMonth: true,
          showInWeek: true,
          posInYear: 0,
          posInMonth: 0,
          posInWeek: 0,
          posInDay: 0
        })
      }),
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          ...board
        })
      }),
      updateDocument: jest.fn(),
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 0,
          documents: []
        })
      })
    } as any
    const result = await addTodo(databases, BOARD_ID, TODO_START_DATE, TODO_END_DATE, [])
    expect(result).toEqual(expectedResult)
  })
})