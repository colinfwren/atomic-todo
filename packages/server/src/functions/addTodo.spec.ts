import {FIND_LIST_ERROR, LIST_UPDATE_ERROR} from "./progressBoard";
import {addTodo, addToListAndParents} from "./addTodo";
import {docAttrs, board, mockListDoc} from "./testCommon";

const TODO_ID = 'dead-beef'
const LIST_ID = 'beef-dead'
const MONTH_ID = 'month'
const WEEK_ID = 'week'
const DAY_ID = 'day'
const BOARD_ID = 'board'

const MONTH_LIST = {
  ...mockListDoc,
  $id: MONTH_ID,
  id: MONTH_ID
}

const WEEK_LIST = {
  ...mockListDoc,
  $id: WEEK_ID,
  id: WEEK_ID,
  parentList: MONTH_ID
}

const DAY_LIST = {
  ...mockListDoc,
  $id: DAY_ID,
  id: DAY_ID,
  parentList: WEEK_ID
}

describe('Adding Todo to list and it\'s parents', () => {
  it('throws an error if unable to read list document', () => {
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        throw new Error(FIND_LIST_ERROR)
      })
    } as any
    expect(() => addToListAndParents(databases, TODO_ID, LIST_ID)).rejects.toThrowError(FIND_LIST_ERROR)
  })

  it('throws an error if unable to update list document', () => {
    const databases = {
      getDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...mockListDoc
        })
      }),
      updateDocument: jest.fn().mockImplementation(() => {
        throw new Error(LIST_UPDATE_ERROR)
      })
    } as any
    expect(() => addToListAndParents(databases, TODO_ID, LIST_ID)).rejects.toThrowError(LIST_UPDATE_ERROR)
  })
  it('Adds Todo to month list only', async () => {
    const mockGetDocument = jest.fn()
    const databases = {
      getDocument: mockGetDocument.mockImplementation(() => {
        return Promise.resolve(MONTH_LIST)
      }),
      updateDocument: jest.fn()
    } as any
    await addToListAndParents(databases, TODO_ID, MONTH_ID)
    expect(mockGetDocument).toHaveBeenCalledTimes(1)
  })
  it('Adds Todo to Week and corresponding Month list', async () => {
    const mockGetDocument = jest.fn()
    const databases = {
      getDocument: mockGetDocument.mockImplementationOnce(() => {
        return Promise.resolve(WEEK_LIST)
      }).mockImplementationOnce(() => {
        return Promise.resolve(MONTH_LIST)
      }),
      updateDocument: jest.fn()
    } as any
    await addToListAndParents(databases, TODO_ID, WEEK_ID)
    expect(mockGetDocument).toHaveBeenCalledTimes(2)
  })
  it('Adds Todo to Day and corresponding Week and Month lists', async () => {
    const mockGetDocument = jest.fn()
    const databases = {
      getDocument: mockGetDocument.mockImplementationOnce(() => {
        return Promise.resolve(DAY_LIST)
      }).mockImplementationOnce(() => {
        return Promise.resolve(WEEK_LIST)
      }).mockImplementationOnce(() => {
        return Promise.resolve(MONTH_LIST)
      }),
      updateDocument: jest.fn()
    } as any
    await addToListAndParents(databases, TODO_ID, DAY_ID)
    expect(mockGetDocument).toHaveBeenCalledTimes(3)
  })
})

describe('Creating a new Todo', () => {
  it('throws an error when unable to create new todo', () => {
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        throw new Error(LIST_UPDATE_ERROR)
      })
    } as any
    expect(() => addTodo(databases, BOARD_ID, MONTH_ID)).rejects.toThrowError(LIST_UPDATE_ERROR)
  })
  it('returns updated board with todo in the appropriate TodoLists', async () => {
    const expectedResult = {
      board,
      lists: [],
      todos: []
    }
    const databases = {
      createDocument: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ...docAttrs,
          $id: TODO_ID,
          id: TODO_ID,
          completed: false,
          name: 'New Todo'
        })
      }),
      getDocument: jest.fn().mockImplementationOnce(() => {
        return Promise.resolve(DAY_LIST)
      }).mockImplementationOnce(() => {
        return Promise.resolve(WEEK_LIST)
      }).mockImplementationOnce(() => {
        return Promise.resolve(MONTH_LIST)
      }).mockImplementation(() => {
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
    const result = await addTodo(databases, BOARD_ID, DAY_ID)
    expect(result).toEqual(expectedResult)
  })
})