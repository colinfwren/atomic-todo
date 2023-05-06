import {updateTodoDoc, updateTodoListDoc, updateTodoBoardDoc} from "./updateDocs";
import {
  BoardNameUpdateInput,
  Todo,
  TodoBoard,
  TodoLevel,
  TodoList,
  TodoListUpdateInput,
  TodoUpdateInput
} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc, TodoListDoc} from "../types";
import {board, docAttrs, errorMessage} from "./testCommon";

describe('Updating TodoList with values', () => {
  const todoListUpdate: TodoListUpdateInput = {
    id: 'dead-beef',
    todos: []
  }

  const updatedTodoList: TodoList = {
    ...todoListUpdate,
    level: TodoLevel.Day,
    parentList: '',
    childLists: [],
    startDate: 568965600
  }

  const updatedTodoListDoc: TodoListDoc = {
    ...updatedTodoList,
    ...docAttrs,
  }

  it('throws an error if unable to update the TodoList doc', async () => {
    const mockDatabases = {
      updateDocument: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any
    await expect(updateTodoListDoc(mockDatabases, todoListUpdate)).rejects.toThrowError(errorMessage)
  })
  it('returns the updated TodoList values', async () => {
    const mockDatabases = {
      updateDocument: jest.fn().mockResolvedValue(updatedTodoListDoc)
    } as any
    const result = await updateTodoListDoc(mockDatabases, todoListUpdate)
    expect(result).toEqual(updatedTodoList)
  })
})

describe('Updating Todo with values', () => {
  const todoUpdate: TodoUpdateInput = {
    id: 'dead-beef',
    completed: false,
    name: 'Test Todo'
  }

  const updatedTodo: Todo = {
    ...todoUpdate
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