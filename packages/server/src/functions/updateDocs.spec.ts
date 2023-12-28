import {updateTodoDoc, updateTodoBoardDoc} from "./updateDocs";
import {
  BoardNameUpdateInput,
  Todo,
  TodoBoard,
  TodoUpdateInput
} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc} from "../types";
import {board, docAttrs, errorMessage} from "./testCommon";

describe('Updating Todo with values', () => {
  const todoUpdate: TodoUpdateInput = {
    id: 'dead-beef',
    completed: false,
    name: 'Test Todo',
    startDate: 1735516800,
    endDate: 1736121600,
    showInYear: true,
    showInMonth: true,
    showInWeek: true,
    posInMonth: 1,
    posInWeek: 2,
    posInDay: 3
  }

  const updatedTodo: Todo = {
    ...todoUpdate as Todo,
    deleted: false
  }

  const updatedTodoDoc: TodoDoc = {
    ...updatedTodo,
    ...docAttrs
  }

  it('throws an error if unable to update the Todo doc', async () => {
     const mockDatabases = {
      updateDocument: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any
    await expect(updateTodoDoc(mockDatabases, todoUpdate)).rejects.toThrowError(errorMessage)
  })
  it('returns the updated Todo values', async () => {
    const mockDatabases = {
      updateDocument: jest.fn().mockResolvedValue(updatedTodoDoc)
    } as any
    const result = await updateTodoDoc(mockDatabases, todoUpdate)
    expect(result).toEqual(updatedTodo)
  })
})

describe('Update Board Name', () => {
  const boardNameUpdate: BoardNameUpdateInput = {
    id: 'dead-beef',
    name: 'Updated Board Name'
  }

  const updatedTodoBoard: TodoBoard = {
    ...board,
    name: boardNameUpdate.name
  }

  const updatedTodoBoardDoc: TodoBoardDoc = {
    ...updatedTodoBoard,
    ...docAttrs
  }

  it('throws an error if unable to update the TodoBoard doc', async () => {
    const mockDatabases = {
      updateDocument: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any
    await expect(updateTodoBoardDoc(mockDatabases, boardNameUpdate)).rejects.toThrowError(errorMessage)
  })
  it('returns the update TodoBoard values', async () => {
    const mockDatabases = {
      updateDocument: jest.fn().mockResolvedValue(updatedTodoBoardDoc)
    } as any
    const result = await updateTodoBoardDoc(mockDatabases, boardNameUpdate)
    expect(result).toEqual(updatedTodoBoard)
  })
})