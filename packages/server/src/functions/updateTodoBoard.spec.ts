import {BoardNameUpdateInput, TodoBoard} from "../generated/graphql";
import {board, docAttrs, errorMessage} from "./testCommon";
import {TodoBoardDoc} from "../types";
import {updateTodoBoard} from "./updateTodoBoard";
import {TestType} from "@atomic-todo/test-reporter";

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
    ...docAttrs,
    todos: []
  }

  it('throws an error if unable to update the TodoBoard doc', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0008',
      testType: TestType.UNIT
    })
    const mockDatabases = {
      updateDocument: jest.fn().mockRejectedValue(new Error(errorMessage))
    } as any
    await expect(updateTodoBoard(mockDatabases, boardNameUpdate)).rejects.toThrowError(errorMessage)
  })
  it('returns the update TodoBoard values', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0006',
      testType: TestType.UNIT
    })
    const mockDatabases = {
      updateDocument: jest.fn().mockResolvedValue(updatedTodoBoardDoc)
    } as any
    const result = await updateTodoBoard(mockDatabases, boardNameUpdate)
    expect(result).toEqual(updatedTodoBoard)
  })
})