import {CREATE_APPWRITE_DOCUMENT_ERROR} from "./progressBoard";
import {addTodoBoard} from "./addTodoBoard";
import {board, docAttrs, USER} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";


describe('Creating a new TodoBoard', () => {
  it('throws an error when unable to create new TodoBoard', () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0002',
      testType: TestType.UNIT
    })
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(CREATE_APPWRITE_DOCUMENT_ERROR)
      })
    } as any
    expect(() => addTodoBoard(databases, USER)).rejects.toThrowError(CREATE_APPWRITE_DOCUMENT_ERROR)
  })
  it('returns created TodoBoard when created', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0001',
      testType: TestType.UNIT
    })
    const expectedResult = {
      board,
      todos: []
    }
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          ...board
        })
      }),
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          ...board,
          todos: []
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
    const result = await addTodoBoard(databases, USER)
    expect(result).toEqual(expectedResult)
  })
})