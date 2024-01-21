import {
  DATE_ERROR,
  moveBoardByWeek,
} from "./progressBoard";
import {BoardMoveDirection} from "../types";
import { mockBoardDoc} from "./testCommon";
import {getTodoBoard} from "./getTodoBoard";
import {TestType} from "@atomic-todo/test-reporter";


jest.mock('node-appwrite')
jest.mock('./getTodoBoard')

const DOCUMENT_READ_ERROR = 'Error reading doc'

describe('Progressing the board scope forward a week', () => {

  afterEach(() => jest.resetAllMocks())

  it('throws an error if unable to get the TodoBoard', () => {
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        throw new Error(DOCUMENT_READ_ERROR)
      })
    } as any
    expect(() => moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)).rejects.toThrowError(DOCUMENT_READ_ERROR)
  })
  it('throws an error if unable to parse the startDate of the current TodoBoard', () => {
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...mockBoardDoc,
          startDate: 'this will fail'
        })
      })
    } as any
    expect(() => moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)).rejects.toThrowError(DATE_ERROR)
  })

  it('throws an error if unable to update the TodoBoard doc with the new TodoBoard data', () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0034',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      }),
      updateDocument: jest.fn().mockImplementation(() => {
        throw new Error(DATE_ERROR)
      })
    } as any
    expect(() => moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)).rejects.toThrowError(DATE_ERROR)
  })
  it('throws an error if unable to read the updated TodoBoard and Todo docs', () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0035',
      testType: TestType.UNIT
    });
    (getTodoBoard as jest.Mock).mockImplementation(() => {
      throw new Error(DOCUMENT_READ_ERROR)
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      }),
      updateDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      })
    } as any
    expect(() => moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)).rejects.toThrowError(DOCUMENT_READ_ERROR)
  })
  it('returns the updated TodoBoard, TodoLists, Todo data when moving forward', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0029',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      }),
      updateDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      })
    } as any
    await moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)
    expect(getTodoBoard).toHaveBeenCalledWith(databases, mockBoardDoc.id)
  })
  it('returns the updated TodoBoard, TodoLists, Todo data when moving backward', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0031',
      testType: TestType.UNIT
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      }),
      updateDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      })
    } as any
    await moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.BACK)
    expect(getTodoBoard).toHaveBeenCalledWith(databases, mockBoardDoc.id)
  })
})
