import {UPDATE_APPWRITE_DOCUMENT_ERROR} from "./progressBoard";
import {deleteTodo} from "./deleteTodo";
import {
  mockTodoDoc,
  mockBoardDoc,
  docAttrs,
  board
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

describe('Deleting a TODO', () => {
  it('throws an error if the update encountered an error', () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0026',
      testType: TestType.UNIT
    })
    const databases = {
      updateDocument: jest.fn().mockImplementation(() => {
        throw new Error(UPDATE_APPWRITE_DOCUMENT_ERROR)
      })
    } as any
    expect(() => deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)).rejects.toThrowError(UPDATE_APPWRITE_DOCUMENT_ERROR)
  })
  it('returns the updated TodoBoard', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0024',
      testType: TestType.UNIT
    })
    const databases = {
      updateDocument: jest.fn().mockImplementation((databases, colId) => {
        return Promise.resolve({
          ...mockTodoDoc,
          deleted: true,
        })
      }),
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 0,
          documents: []
        })
      }),
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          ...board,
          todos: []
        })
      }),
    } as any
    const expectedResult = {
      board,
      todos: []
    }
    const result = await deleteTodo(databases, mockBoardDoc.$id, mockTodoDoc.$id)
    expect(result).toEqual(expectedResult)
  })
})