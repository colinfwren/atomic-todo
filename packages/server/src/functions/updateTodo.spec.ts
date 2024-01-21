import {updateTodo} from "./updateTodo";
import {
  Todo,
  TodoUpdateInput
} from "../generated/graphql";
import {TodoDoc} from "../types";
import {docAttrs, errorMessage} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

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
     atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0019',
      testType: TestType.UNIT
    })
     const mockDatabases = {
      updateDocument: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any
    await expect(updateTodo(mockDatabases, todoUpdate)).rejects.toThrowError(errorMessage)
  })
  it('returns the updated Todo values', async () => {
     atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0017',
      testType: TestType.UNIT
    })
    const mockDatabases = {
      updateDocument: jest.fn().mockResolvedValue(updatedTodoDoc)
    } as any
    const result = await updateTodo(mockDatabases, todoUpdate)
    expect(result).toEqual(updatedTodo)
  })
})