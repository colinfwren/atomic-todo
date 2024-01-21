import { createApolloServer } from "../server";
import request from 'supertest'
import {getNewUser, addTodoBoardMutationData, getTodoBoardDetails} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

describe('Adding TodoBoard System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Adds a TodoBoard to user\'s account and sets permissions correctly', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0001',
      testType: TestType.SYSTEM
    })
    const { user, jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.body.errors).toBeUndefined()
    expect(addTodoBoard.body.data?.addTodoBoard).toMatchObject({
      board: {
        name: 'New TodoBoard'
      },
      todos: []
    })
    const createdTodoBoard = await getTodoBoardDetails(addTodoBoard.body.data?.addTodoBoard.board.id)
    expect(createdTodoBoard.$permissions).toMatchObject([
      `read("user:${user.$id}")`,
      `update("user:${user.$id}")`,
      `delete("user:${user.$id}")`
    ])
  })
})