import {DATE_ERROR, FIND_LIST_ERROR, moveBoardByWeek, processDays, processMonths, processWeeks} from "./progressBoard";
import {BoardMoveDirection, TodoBoardDoc, TodoBoardProgressionArgs, TodoListDoc} from "../types";
import {docAttrs} from "./testCommon";
import {TodoLevel} from "../generated/graphql";
import {asyncPipe} from "./utils";
import {getTodoBoard} from "./getDocs";

jest.mock('node-appwrite')
jest.mock('./utils')
jest.mock('./getDocs')

const CREATE_MONTH_ERROR = 'Error creating new month'
const DOCUMENT_READ_ERROR = 'Error reading doc'

const mockListDoc: TodoListDoc = {
  ...docAttrs,
  id: docAttrs.$id,
  childLists: [],
  parentList: '',
  level: TodoLevel.Day,
  startDate: 1683500400,
  todos: ['bad_todos']
}

const mockDatabases = {
  createDocument: jest.fn()
} as any

const mockBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Todo Board',
  startDate: 1680476400,
  id: docAttrs.$id,
  days: Array(7).fill(0).map( (x, i) => `day-list-${i}`),
  weeks: Array(6).fill(0).map( (x, i) => `week-list-${i}`),
  months: Array(6).fill(0).map( (x, i) => `month-list-${i}`)
}

const mockStartDate = new Date('2023-04-03T00:00:00.000Z')

const mockArgs: TodoBoardProgressionArgs = {
  databases: mockDatabases,
  boardDoc: mockBoardDoc,
  newStartDate: mockStartDate
}

describe('Processing the Month level TodoLists for a TodoBoard that has progressed a week', () => {

  const mockArgsWithNewMonth = {
    ...mockArgs,
    newStartDate: new Date('2023-05-01T00:00:00.000Z')
  }

  it('throws an error if unable to parse the startDate of the current TodoBoard', () => {
    const boardWithBadStartDate = {
      ...mockBoardDoc,
      startDate: -1
    }
    expect(() => processMonths({ ...mockArgs, boardDoc: boardWithBadStartDate })).rejects.toThrowError(DATE_ERROR)
  })
  it('throws an error if unable to parse the new board date', () => {
    expect(() => processMonths({ ...mockArgs, newStartDate: new Date('this will fail') })).rejects.toThrowError(DATE_ERROR)
  })
  it('returns the existing TodoBoard if new board date is within the same month', async () => {
    const result = await processMonths(mockArgs)
    expect(result).toEqual(mockArgs)
  })
  it('throws an error if unable to create the new Month level TodoList when needed', () => {
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processMonths(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('returns an updated TodoBoard with the current Month level TodoList removed and the new Month level TodoList added', async () => {
    const expectedResult = {
      ...mockBoardDoc,
      months: ['month-list-1', 'month-list-2', 'month-list-3', 'month-list-4', 'month-list-5', mockListDoc.$id],
    }
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        createDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockListDoc)
        })
      } as any
    }
    const result = await processMonths(args)
    expect(result.boardDoc).toEqual(expectedResult)
  })
})

describe('Processing the Week level TodoLists for a TodoBoard that has progressed a week', () => {
  it('throws an error if unable to read the doc for the last Month level TodoList in the TodoBoard', () => {
    const args = {
      ...mockArgs,
      databases: {
        getDocument: jest.fn().mockImplementation(() => {
          throw new Error(DOCUMENT_READ_ERROR)
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(DOCUMENT_READ_ERROR)
  })
  it('throws an error if unable to parse the startDate of the current last Week level TodoList in the TodoBoard', () => {
    const args = {
      ...mockArgs,
      databases: {
        getDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            ...mockListDoc,
            startDate: 'this will fail'
          })
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(DATE_ERROR)
  })
  it('throws an error if unable to find the doc for the Month level TodoList that the new Week level TodoList would fall under', () => {
    const args = {
      ...mockArgs,
      databases: {
        getDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockListDoc)
        }),
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({ total: 0, documents: []})
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(FIND_LIST_ERROR)
  })
  it('throws an error if unable to create the new Week level TodoList', () => {
    const args = {
      ...mockArgs,
      databases: {
        getDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockListDoc)
        }),
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [{
              ...mockListDoc,
              startDate: '2023-05-01T00:00:00.000Z'
            }]
          })
        }),
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('returns an updated TodoBoard with the current Week level TodoList removed and the new Week level TodoList added', async ()  => {
    const args = {
      ...mockArgs,
      databases: {
        getDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockListDoc)
        }),
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [{
              ...mockListDoc,
              startDate: '2023-05-01T00:00:00.000Z'
            }]
          })
        }),
        createDocument: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockListDoc)
        })
      } as any
    }
    const expectedResult = {
      ...mockBoardDoc,
      weeks: ['week-list-1', 'week-list-2', 'week-list-3', "week-list-4", "week-list-5", mockListDoc.$id]
    }
    const result = await processWeeks(args)
    expect(result.boardDoc).toEqual(expectedResult)
  })
})

describe('Processing the Day level TodoLists for a TodoBoard that has progressed a week', () => {
  it('throws an error if unable to copy the startDate passed in', () => {
    expect(() => processDays({ ...mockArgs, newStartDate: new Date('this will fail') })).rejects.toThrowError(DATE_ERROR)
  })
  it('throws an error if unable to read the first week from the TodoBoard', () => {
    const args = {
      ...mockArgs,
      boardDoc: {
        ...mockBoardDoc,
        weeks: []
      }
    }
    expect(() => processDays(args)).rejects.toThrowError()
  })
  it('throws an error if unable to create a new Day level TodoList', () => {
    const args = {
      ...mockArgs,
      databases: {
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processDays(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('returns an updated TodoBoard with the current Day level TodoLists removed and the new Day level TodoLists added', async () => {
    const args = {
      ...mockArgs,
      databases: {
        createDocument: jest.fn().mockImplementation((databaseId, collectionId, docId, data) => {
          return {
            ...mockListDoc,
            $id: data.startDate.split('T')[0],
          }
        })
      } as any,
      newStartDate: new Date('2023-04-10T00:00:00.000Z')
    }
    const expectedResult = {
      ...mockBoardDoc,
      days: ['2023-04-10', '2023-04-11', '2023-04-12', '2023-04-13', '2023-04-14', '2023-04-15', '2023-04-16']
    }
    const result = await processDays(args)
    expect(result.boardDoc).toEqual(expectedResult)
  })
})

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
  it('throws an error if an error is thrown when processing the new TodoLists', () => {
    (asyncPipe as jest.Mock).mockImplementation(() => {
      throw new Error(DATE_ERROR)
    })
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve(mockBoardDoc)
      })
    } as any
    expect(() => moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.FORWARD)).rejects.toThrowError(DATE_ERROR)
  })
  it('throws an error if unable to update the TodoBoard doc with the new TodoBoard data', () => {
    (asyncPipe as jest.Mock).mockImplementation(() => {
      return jest.fn().mockResolvedValue(mockArgs)
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
  it('throws an error if unable to read the updated TodoBoard, TodoLists and Todo docs', () => {
    (asyncPipe as jest.Mock).mockImplementation(() => {
      return jest.fn().mockResolvedValue(mockArgs)
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
  it('returns the updated TodoBoard, TodoLists, Todo data', async () => {
    (asyncPipe as jest.Mock).mockImplementation(() => {
      return jest.fn().mockResolvedValue(mockArgs)
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
})