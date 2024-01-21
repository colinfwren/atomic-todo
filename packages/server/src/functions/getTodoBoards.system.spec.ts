import { createApolloServer } from "../server";
import request from 'supertest'
import {getNewUser, addTodoBoardMutationData, getTodoBoardQueryData, getTodoBoardsQueryData} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

describe('Reading TodoBoard list System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('User can read a list of TodoBoards that user has permissions to read', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0012',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.errors).toBeUndefined()
    const boardData = addTodoBoard.body.data?.addTodoBoard.board
    const { jwt: otherJwt } = await getNewUser()
    await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(addTodoBoardMutationData)
    const getTodoBoards = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(getTodoBoardsQueryData)
    expect(getTodoBoards.body.errors).toBeUndefined()
    expect(getTodoBoards.body.data?.getTodoBoards).toEqual([
      boardData
    ])
  })
})