import {FIND_LIST_ERROR, LIST_UPDATE_ERROR} from "./progressBoard";
import {deleteTodo} from "./deleteTodo";
import {
  mockTodoDoc,
  mockBoardDoc,
  mockListDoc,
  docAttrs,
  board
} from "./testCommon";
import {TODO_COL_ID, TODOLIST_COL_ID} from "../consts";

describe('Deleting a TODO', () => {
  it('throws an error if the update encountered an error', () => {
    const databases = {
      updateDocument: jest.fn().mockImplementation(() => {
        throw new Error(LIST_UPDATE_ERROR)
      })
    } as any
    expect(() => deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)).rejects.toThrowError(LIST_UPDATE_ERROR)
  })
  it('throws an error if getting the list containing the todo encounters an error', () => {
    const databases = {
      updateDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...mockTodoDoc,
          deleted: true,
        })
      }),
      listDocuments: jest.fn().mockImplementation(() => {
        throw new Error(FIND_LIST_ERROR)
      })
    } as any
    expect(() => deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)).rejects.toThrowError(FIND_LIST_ERROR)
  })
  it('throws an error if updating the lists containing the todo encounters an error', () => {
    const databases = {
      updateDocument: jest.fn().mockImplementation((databases, colId) => {
        if(colId === TODO_COL_ID) {
          return Promise.resolve({
            ...mockTodoDoc,
            deleted: true,
          })
        }
        throw new Error(LIST_UPDATE_ERROR)
      }),
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 1,
          documents: [
            mockListDoc
          ]
        })
      })
    } as any
    expect(() => deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)).rejects.toThrowError(LIST_UPDATE_ERROR)
  })
  it('returns the updated TodoBoard', async () => {
    const databases = {
      updateDocument: jest.fn().mockImplementation((databases, colId) => {
        if(colId === TODO_COL_ID) {
          return Promise.resolve({
            ...mockTodoDoc,
            deleted: true,
          })
        }
        if(colId === TODOLIST_COL_ID) {
          return Promise.resolve(mockListDoc)
        }
      }),
      listDocuments: jest.fn().mockImplementationOnce(() => {
        return Promise.resolve({
          total: 1,
          documents: [
            mockListDoc
          ]
        })
      }).mockImplementation(() => {
        return Promise.resolve({
          total: 0,
          documents: []
        })
      }),
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          ...board
        })
      }),
    } as any
    const expectedResult = {
      board,
      lists: [],
      todos: []
    }
    const result = await deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)
    expect(result).toEqual(expectedResult)
  })
})