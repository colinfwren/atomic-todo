import {updateTodoDoc, updateTodoListDoc} from "./updateDocs";
import {Todo, TodoLevel, TodoList, TodoListUpdateInput, TodoUpdateInput} from "../generated/graphql";
import {TodoDoc, TodoListDoc} from "../types";
import { docAttrs, errorMessage } from "./testCommon";

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
    startDate: ''
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