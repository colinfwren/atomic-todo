import {
  createDayLists,
  createMonthLists, createWeekLists,
  DATE_ERROR,
  FIND_LIST_ERROR,
  getExistingTodoLists,
  getListMapAndListsToCreate,
  getNextSevenDays,
  getNextSixMonths,
  getNextSixWeeks,
  moveBoardByWeek,
  processDays,
  processMonths,
  processWeeks
} from "./progressBoard";
import {BoardMoveDirection, TodoBoardDoc, TodoBoardProgressionArgs, TodoListDoc} from "../types";
import {docAttrs} from "./testCommon";
import {TodoLevel} from "../generated/graphql";
import {asyncPipe} from "./utils";
import {getTodoBoard} from "./getDocs";


jest.mock('node-appwrite')
jest.mock('./utils', () => {
  return {
    __esModule: true,
    ...jest.requireActual('./utils'),
    asyncPipe: jest.fn()
  }
})
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

const MONTH_TIMESTAMPS = [
  new Date('2023-01-01T00:00:00.000Z'),
  new Date('2023-02-01T00:00:00.000Z'),
  new Date('2023-03-01T00:00:00.000Z'),
  new Date('2023-04-01T00:00:00.000Z'),
  new Date('2023-05-01T00:00:00.000Z'),
  new Date('2023-06-01T00:00:00.000Z'),
  new Date('2023-07-01T00:00:00.000Z'),
  new Date('2023-08-01T00:00:00.000Z'),
  new Date('2023-09-01T00:00:00.000Z'),
  new Date('2023-10-01T00:00:00.000Z'),
  new Date('2023-11-01T00:00:00.000Z'),
  new Date('2023-12-01T00:00:00.000Z'),
  new Date('2024-01-01T00:00:00.000Z'),
  new Date('2024-02-01T00:00:00.000Z'),
  new Date('2024-03-01T00:00:00.000Z'),
  new Date('2024-04-01T00:00:00.000Z'),
  new Date('2024-05-01T00:00:00.000Z'),
  new Date('2024-06-01T00:00:00.000Z'),
  new Date('2024-07-01T00:00:00.000Z'),
].map((monthDate: Date) => monthDate.getTime() / 1000)

const TEST_WEEKS = [
  new Date('2023-01-02T00:00:00.000Z'),
  new Date('2023-01-09T00:00:00.000Z'),
  new Date('2023-01-16T00:00:00.000Z'),
  new Date('2023-01-23T00:00:00.000Z'),
  new Date('2023-01-30T00:00:00.000Z'),
  new Date('2023-02-06T00:00:00.000Z'),
  new Date('2023-02-13T00:00:00.000Z'),
  new Date('2023-02-20T00:00:00.000Z'),
  new Date('2023-02-27T00:00:00.000Z'),
  new Date('2023-03-06T00:00:00.000Z'),
  new Date('2023-03-13T00:00:00.000Z'),
  new Date('2023-03-20T00:00:00.000Z'),
  new Date('2023-03-27T00:00:00.000Z'),
  new Date('2023-04-03T00:00:00.000Z'),
  new Date('2023-04-10T00:00:00.000Z'),
  new Date('2023-04-17T00:00:00.000Z'),
  new Date('2023-04-24T00:00:00.000Z'),
  new Date('2023-05-01T00:00:00.000Z'),
  new Date('2023-05-08T00:00:00.000Z'),
  new Date('2023-05-15T00:00:00.000Z'),
  new Date('2023-05-22T00:00:00.000Z'),
  new Date('2023-05-29T00:00:00.000Z'),
  new Date('2023-06-05T00:00:00.000Z'),
  new Date('2023-06-12T00:00:00.000Z'),
  new Date('2023-06-19T00:00:00.000Z'),
  new Date('2023-06-26T00:00:00.000Z'),
  new Date('2023-07-03T00:00:00.000Z'),
  new Date('2023-07-10T00:00:00.000Z'),
  new Date('2023-07-17T00:00:00.000Z'),
  new Date('2023-07-24T00:00:00.000Z'),
  new Date('2023-07-31T00:00:00.000Z'),
  new Date('2023-08-07T00:00:00.000Z'),
  new Date('2023-08-14T00:00:00.000Z'),
  new Date('2023-08-21T00:00:00.000Z'),
  new Date('2023-08-28T00:00:00.000Z'),
  new Date('2023-09-04T00:00:00.000Z'),
  new Date('2023-09-11T00:00:00.000Z'),
  new Date('2023-09-18T00:00:00.000Z'),
  new Date('2023-09-25T00:00:00.000Z'),
  new Date('2023-10-02T00:00:00.000Z'),
  new Date('2023-10-09T00:00:00.000Z'),
  new Date('2023-10-16T00:00:00.000Z'),
  new Date('2023-10-23T00:00:00.000Z'),
  new Date('2023-10-30T00:00:00.000Z'),
  new Date('2023-11-06T00:00:00.000Z'),
  new Date('2023-11-13T00:00:00.000Z'),
  new Date('2023-11-20T00:00:00.000Z'),
  new Date('2023-11-27T00:00:00.000Z'),
  new Date('2023-12-04T00:00:00.000Z'),
  new Date('2023-12-11T00:00:00.000Z'),
  new Date('2023-12-18T00:00:00.000Z'),
  new Date('2023-12-25T00:00:00.000Z'),
  new Date('2024-01-01T00:00:00.000Z'),
  new Date('2024-01-08T00:00:00.000Z'),
  new Date('2024-01-15T00:00:00.000Z'),
  new Date('2024-01-22T00:00:00.000Z'),
  new Date('2024-01-29T00:00:00.000Z'),
  new Date('2024-02-05T00:00:00.000Z'),
  new Date('2024-02-12T00:00:00.000Z'),
]

const WEEK_TIMESTAMPS = TEST_WEEKS.map((weekDate: Date) =>weekDate.getTime() / 1000)

const TEST_DAY_TIMESTAMPS = [
  new Date('2023-01-09T00:00:00.000Z'),
  new Date('2023-01-10T00:00:00.000Z'),
  new Date('2023-01-11T00:00:00.000Z'),
  new Date('2023-01-12T00:00:00.000Z'),
  new Date('2023-01-13T00:00:00.000Z'),
  new Date('2023-01-14T00:00:00.000Z'),
  new Date('2023-01-15T00:00:00.000Z'),
].map((dayDate: Date) => dayDate.getTime() / 1000)

const TEST_DAY_TIMESTAMPS_MONTH_BOUNDARY = [
  new Date('2024-01-29T00:00:00.000Z'),
  new Date('2024-01-30T00:00:00.000Z'),
  new Date('2024-01-31T00:00:00.000Z'),
  new Date('2024-02-01T00:00:00.000Z'),
  new Date('2024-02-02T00:00:00.000Z'),
  new Date('2024-02-03T00:00:00.000Z'),
  new Date('2024-02-04T00:00:00.000Z'),
].map((dayDate: Date) => dayDate.getTime() / 1000)

const TEST_DAY_TIMESTAMPS_YEAR_BOUNDARY = [
  new Date('2024-12-30T00:00:00.000Z'),
  new Date('2024-12-31T00:00:00.000Z'),
  new Date('2025-01-01T00:00:00.000Z'),
  new Date('2025-01-02T00:00:00.000Z'),
  new Date('2025-01-03T00:00:00.000Z'),
  new Date('2025-01-04T00:00:00.000Z'),
  new Date('2025-01-05T00:00:00.000Z'),
].map((dayDate: Date) => dayDate.getTime() / 1000)

const TEST_DAY_TIMESTAMPS_LEAP_YEAR = [
  new Date('2024-02-26T00:00:00.000Z'),
  new Date('2024-02-27T00:00:00.000Z'),
  new Date('2024-02-28T00:00:00.000Z'),
  new Date('2024-02-29T00:00:00.000Z'),
  new Date('2024-03-01T00:00:00.000Z'),
  new Date('2024-03-02T00:00:00.000Z'),
  new Date('2024-03-03T00:00:00.000Z'),
].map((dayDate: Date) => dayDate.getTime() / 1000)

describe('Getting the start dates of month lists for the next six months', () => {
  it.each([
    { startDate: '2023-01-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(0, 6)},
    { startDate: '2023-02-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(1, 7)},
    { startDate: '2023-03-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(2, 8)},
    { startDate: '2023-04-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(3, 9)},
    { startDate: '2023-05-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(4, 10)},
    { startDate: '2023-06-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(5, 11)},
    { startDate: '2023-07-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(6, 12)},
    { startDate: '2023-08-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(7, 13)},
    { startDate: '2023-09-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(8, 14)},
    { startDate: '2023-10-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(9, 15)},
    { startDate: '2023-11-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(10, 16)},
    { startDate: '2023-12-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(11, 17)},
    { startDate: '2024-01-12T00:00:00.000Z', expectedTimestamps: MONTH_TIMESTAMPS.slice(12, 18)},
  ])('generates timestamps for the next six months from $startDate', ({ startDate, expectedTimestamps }) => {
    expect(getNextSixMonths(new Date(startDate))).toEqual(expectedTimestamps)
  })
})

describe('Getting the start dates of week lists for the next six weeks', () => {
  it.each(TEST_WEEKS.slice(0, 54).map((week, index) => {
    return {
      startDate: week.toISOString(),
      expectedTimestamps: WEEK_TIMESTAMPS.slice(index, index + 6)
    }
  }))('generates timestamps for the next six weeks from $startDate', ({ startDate, expectedTimestamps}) => {
    expect(getNextSixWeeks(new Date(startDate))).toEqual(expectedTimestamps)
  })
})

describe('Getting the start dates of day lists for the next seven days', () => {
  it('generates timestamps for the next seven days for a week fully inside of a month', () => {
    expect(getNextSevenDays(new Date('2023-01-09T00:00:00.000Z'))).toEqual(TEST_DAY_TIMESTAMPS)
  })
  it('generates timestamps for the next seven days for a week across a month boundary', () => {
    expect(getNextSevenDays(new Date('2024-01-29T00:00:00.000Z'))).toEqual(TEST_DAY_TIMESTAMPS_MONTH_BOUNDARY)
  })
  it('generates timestamps for the next seven days for a week across a year boundary', () => {
    expect(getNextSevenDays(new Date('2024-12-30T00:00:00.000Z'))).toEqual(TEST_DAY_TIMESTAMPS_YEAR_BOUNDARY)
  })
  it('generates timestamps for the next seven days for a week across the leap year month boundary', () => {
    expect(getNextSevenDays(new Date('2024-02-26T00:00:00.000Z'))).toEqual(TEST_DAY_TIMESTAMPS_LEAP_YEAR)
  })
})

describe('Getting TodoLists for an array of start dates', () => {
  it('throws an error if the search encounters an issue', () => {
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        throw new Error(FIND_LIST_ERROR)
      })
    } as any
    expect(() => getExistingTodoLists(databases, TodoLevel.Day, TEST_DAY_TIMESTAMPS)).rejects.toThrowError(FIND_LIST_ERROR)
  })
  it('returns the TodoList documents when the search finds some results', async () => {
    const mockResult = { total: 1, documents: [mockListDoc]}
    const databases = {
      listDocuments: jest.fn().mockResolvedValue(mockResult)
    } as any
    const result = await getExistingTodoLists(databases, TodoLevel.Day, TEST_DAY_TIMESTAMPS)
    expect(result).toEqual(mockResult)
  })
  it('returns no TodoList documents when the search finds no results', async () => {
    const mockResult = { total: 0, documents: []}
    const databases = {
      listDocuments: jest.fn().mockResolvedValue(mockResult)
    } as any
    const result = await getExistingTodoLists(databases, TodoLevel.Day, TEST_DAY_TIMESTAMPS)
    expect(result).toEqual(mockResult)
  })
})

describe('Getting a map of the existing TodoLists and an array of start dates to create new TodoLists for', () => {
  it('returns a listMap with all values set and an empty listsToCreate array if all dates exist already', () => {
    const nextListDates = [1, 2, 3, 4, 5, 6]
    const listSearchResults = {
      total: 6,
      documents: nextListDates.map((date) => {
        return {
          ...mockListDoc,
          startDate: date
        }
      })
    }
    const expectedResult = {
      listMap: new Map<number, TodoListDoc>(listSearchResults.documents.map((doc) => [doc.startDate, doc])),
      listsToCreate: []
    }
    expect(getListMapAndListsToCreate(listSearchResults, nextListDates)).toEqual(expectedResult)
  })
  it('returns a listMap with no values set and a full listsToCreate array if no dates exist already', () => {
    const nextListDates = [1, 2, 3, 4, 5, 6]
    const listSearchResults = {
      total: 0,
      documents: []
    }
    const expectedResult = {
      listMap: new Map<number, TodoListDoc>(),
      listsToCreate: nextListDates
    }
    expect(getListMapAndListsToCreate(listSearchResults, nextListDates)).toEqual(expectedResult)
  })
  it('returns a listMap with existing values set and a listsToCreate array with the values that need to be created', () => {
    const nextListDates = [1, 2, 3, 4, 5, 6]
    const listSearchResults = {
      total: 3,
      documents: nextListDates.slice(0, 3).map((date) => {
        return {
          ...mockListDoc,
          startDate: date
        }
      })
    }
    const expectedResult = {
      listMap: new Map<number, TodoListDoc>(listSearchResults.documents.map((doc) => [doc.startDate, doc])),
      listsToCreate: nextListDates.slice(3, 6)
    }
    expect(getListMapAndListsToCreate(listSearchResults, nextListDates)).toEqual(expectedResult)
  })
})

describe('Creating month level TodoLists that need to be created', () => {
  const mapAndIds = {
    listMap: new Map<number, TodoListDoc>([1, 2, 3].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Month, todos: [] }])),
    listsToCreate: [4, 5, 6]
  }
  it('throws an error if there was an issue creating a list', () => {
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(CREATE_MONTH_ERROR)
      })
    } as any
    expect(() => createMonthLists(databases, mapAndIds)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('creates the month level TodoLists and updates the listMap with the new documents', async () => {
    const databases = {
      createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
        return Promise.resolve({
          ...mockListDoc,
          ...data
        })
      })
    } as any
    const expectedResult = new Map<number, TodoListDoc>([1, 2, 3, 4, 5, 6].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Month, todos: [] }]))
    const result = await createMonthLists(databases, mapAndIds)
    expect(result).toEqual(expectedResult)
  })
})

describe('Creating week level TodoLists that need to be created', () => {
  const monthId = 'dead-beef'
  const mapAndIds = {
    listMap: new Map<number, TodoListDoc>([1, 2, 3].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Week, todos: [], parentList: monthId }])),
    listsToCreate: [4, 5, 6]
  }
  it('throws an error if there is an issue finding the month document for the new week', () => {
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        throw new Error(FIND_LIST_ERROR)
      })
    } as any
    expect(() => createWeekLists(databases, mapAndIds)).rejects.toThrowError(FIND_LIST_ERROR)
  })
  it('throws an error if unable to find the month document for the new week', () => {
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 0,
          documents: []
        })
      })
    } as any
    expect(() => createWeekLists(databases, mapAndIds)).rejects.toThrowError(FIND_LIST_ERROR)
  })
  it('throws an error if there is an issue creating the new week document', () => {
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 1,
          documents: [ mockListDoc ]
        })
      }),
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(CREATE_MONTH_ERROR)
      })
    } as any
    expect(() => createWeekLists(databases, mapAndIds)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('creates the week level TodoLists and updates the listMap with the new documents', async () => {
    const databases = {
      listDocuments: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          total: 1,
          documents: [ { ...mockListDoc, $id: monthId, id: monthId }]
        })
      }),
      createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
        return Promise.resolve({
          ...mockListDoc,
          ...data
        })
      })
    } as any
    const expectedResult = new Map<number, TodoListDoc>([1, 2, 3, 4, 5, 6].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Week, todos: [], parentList: monthId }]))
    const result = await createWeekLists(databases, mapAndIds)
    expect(result).toEqual(expectedResult)
  })
})

describe('Create day level TodoLists that need to be created', () => {
  const weekId = 'dead-beef'
  const mapAndIds = {
    listMap: new Map<number, TodoListDoc>([1, 2, 3].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Day, todos: [], parentList: weekId }])),
    listsToCreate: [4, 5, 6]
  }
  it('throws an error if there was an issue creating a day TodoList', () => {
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(CREATE_MONTH_ERROR)
      })
    } as any
    expect(() => createDayLists(databases, mapAndIds, weekId)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })
  it('creates the day level TodoLists and updates the listMap with the new documents', async () => {
    const databases = {
      createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
        return Promise.resolve({
          ...mockListDoc,
          ...data
        })
      })
    } as any
    const expectedResult = new Map<number, TodoListDoc>([1, 2, 3, 4, 5, 6].map((id) => [id, { ...mockListDoc, startDate: id, level: TodoLevel.Day, todos: [], parentList: weekId }]))
    const result = await createDayLists(databases, mapAndIds, weekId)
    expect(result).toEqual(expectedResult)
  })
})

describe('Processing the Month level TodoLists for a TodoBoard that has changes start date', () => {

  const mockArgsWithNewMonth = {
    ...mockArgs,
    newStartDate: new Date('2023-01-01T00:00:00.000Z')
  }

  const monthListTimestamps = MONTH_TIMESTAMPS.slice(0, 6)

  it('throws an error if there\'s an issue getting the existing lists', () => {
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          throw new Error(FIND_LIST_ERROR)
        })
      } as any
    }
    expect(() => processMonths(args)).rejects.toThrowError(FIND_LIST_ERROR)
  })

  it('throws an error if there\'s an issue creating the new lists', () => {
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [ mockListDoc ]
          })
        }),
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processMonths(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })

  it('returns the existing month TodoLists if they already exist for the next six month period', async () => {
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 6,
            documents: monthListTimestamps.map((startDate) => ({ ...mockListDoc, startDate, $id: `${startDate}` }))
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        months: monthListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processMonths(args)
    expect(result).toEqual(expectedResult)
  })

  it('creates any month level TodoLists that don\'t exist for the next six month period', async () => {
    const args = {
      ...mockArgsWithNewMonth,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 0,
            documents: []
          })
        }),
        createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
          return Promise.resolve({
            ...mockListDoc,
            ...data,
            $id: `${data.startDate}`
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        months: monthListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processMonths(args)
    expect(result).toEqual(expectedResult)
  })
})

describe('Processing the Week level TodoLists for a TodoBoard that has changes start date', () => {

  const mockArgsWithNewWeek = {
    ...mockArgs,
    newStartDate: new Date('2023-01-02T00:00:00.000Z')
  }

  const weekListTimestamps = WEEK_TIMESTAMPS.slice(0, 6)

  it('throws an error if there\'s an issue getting the existing week lists', () => {
    const args = {
      ...mockArgsWithNewWeek,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          throw new Error(FIND_LIST_ERROR)
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(FIND_LIST_ERROR)
  })

  it('throws an error if there\'s an issue creating the new week lists', () => {
    const args = {
      ...mockArgsWithNewWeek,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [ mockListDoc ]
          })
        }),
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processWeeks(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })

  it('returns the existing week TodoLists if they already exist for the next six week period', async () => {
    const args = {
      ...mockArgsWithNewWeek,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 6,
            documents: weekListTimestamps.map((startDate) => ({ ...mockListDoc, startDate, $id: `${startDate}` }))
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        weeks: weekListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processWeeks(args)
    expect(result).toEqual(expectedResult)
  })

  it('creates any week level TodoLists that don\'t exist for the next six week period', async () => {
    const args = {
      ...mockArgsWithNewWeek,
      databases: {
        listDocuments: jest.fn().mockImplementationOnce(() => {
          return Promise.resolve({
            total: 0,
            documents: []
          })
        }).mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [ mockListDoc ]
          })
        }),
        createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
          return Promise.resolve({
            ...mockListDoc,
            ...data,
            $id: `${data.startDate}`
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        weeks: weekListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processWeeks(args)
    expect(result).toEqual(expectedResult)
  })
})

describe('Processing the Day level TodoLists for a TodoBoard that has changes start date', () => {

  const mockArgsWithNewDate = {
    ...mockArgs,
    newStartDate: new Date('2023-01-09T00:00:00.000Z')
  }

  const dayListTimestamps = TEST_DAY_TIMESTAMPS

  it('throws an error if there\'s an issue getting the existing day lists', () => {
    const args = {
      ...mockArgsWithNewDate,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          throw new Error(FIND_LIST_ERROR)
        })
      } as any
    }
    expect(() => processDays(args)).rejects.toThrowError(FIND_LIST_ERROR)
  })

  it('throws an error if there\'s an issue creating the new day lists', () => {
    const args = {
      ...mockArgsWithNewDate,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 1,
            documents: [ mockListDoc ]
          })
        }),
        createDocument: jest.fn().mockImplementation(() => {
          throw new Error(CREATE_MONTH_ERROR)
        })
      } as any
    }
    expect(() => processDays(args)).rejects.toThrowError(CREATE_MONTH_ERROR)
  })

  it('returns the existing day TodoLists if they already exist for the next seven day period', async () => {
    const args = {
      ...mockArgsWithNewDate,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 7,
            documents: dayListTimestamps.map((startDate) => ({ ...mockListDoc, startDate, $id: `${startDate}` }))
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        days: dayListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processDays(args)
    expect(result).toEqual(expectedResult)
  })

  it('creates any day level TodoLists that don\'t exist for the next seven day period', async () => {
    const args = {
      ...mockArgsWithNewDate,
      databases: {
        listDocuments: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            total: 0,
            documents: []
          })
        }),
        createDocument: jest.fn().mockImplementation((dbId, colId, docId, data) => {
          return Promise.resolve({
            ...mockListDoc,
            ...data,
            $id: `${data.startDate}`
          })
        })
      } as any
    }
    const expectedResult = {
      ...args,
      boardDoc: {
        ...mockBoardDoc,
        days: dayListTimestamps.map((startDate) => `${startDate}`)
      }
    }
    const result = await processDays(args)
    expect(result).toEqual(expectedResult)
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
  it('returns the updated TodoBoard, TodoLists, Todo data when moving forward', async () => {
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
  it('returns the updated TodoBoard, TodoLists, Todo data when moving backward', async () => {
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
    await moveBoardByWeek(databases, mockBoardDoc.id, BoardMoveDirection.BACK)
    expect(getTodoBoard).toHaveBeenCalledWith(databases, mockBoardDoc.id)
  })
})