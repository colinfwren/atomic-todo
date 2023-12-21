import {
  DATE_ERROR,
  moveBoardByWeek,
} from "./progressBoard";
import {BoardMoveDirection} from "../types";
import { mockBoardDoc} from "./testCommon";
import {getTodoBoard} from "./getDocs";


jest.mock('node-appwrite')
jest.mock('./getDocs')

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
