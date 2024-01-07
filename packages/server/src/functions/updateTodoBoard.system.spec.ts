import { createApolloServer } from "../server";
import request from 'supertest'
import {getNewUser, addTodoBoardMutationData, getTodoBoardDetails, updateTodoBoardNameMutationData} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

describe('Updating TodoBoard System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Updates a TodoBoard that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0006',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.errors).toBeUndefined()
    const boardId = addTodoBoard.body.data?.addTodoBoard.board.id
    const UPDATED_NAME = 'Updated Board Name'
    const updateTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoBoardNameMutationData(boardId, UPDATED_NAME))
    expect(updateTodoBoard.body.errors).toBeUndefined()
    expect(updateTodoBoard.body.data?.updateBoardName).toMatchObject({
      name: UPDATED_NAME,
    })
  })

  test('Does not update a TodoBoard that user has no permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0007',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.errors).toBeUndefined()
    const boardId = addTodoBoard.body.data?.addTodoBoard.board.id
    const UPDATED_NAME = 'Updated Board Name'
    const { jwt: otherJwt } = await getNewUser()
    const updateTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(updateTodoBoardNameMutationData(boardId, UPDATED_NAME))
    expect(updateTodoBoard.body.errors).toMatchObject([
      {
        message: 'The current user is not authorized to perform the requested action.'
      }
    ])
    expect(updateTodoBoard.body.data?.updateBoardName).toBeNull()
  })
})