import { createApolloServer } from "../server";
import request from 'supertest'
import {getNewUser, addTodoBoardMutationData, getTodoBoardQueryData} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

describe('Reading TodoBoard System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('User can read a TodoBoard that user has permissions to read', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0003',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.errors).toBeUndefined()
    const boardId = addTodoBoard.body.data?.addTodoBoard.board.id
    const getTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(getTodoBoardQueryData(boardId))
    expect(getTodoBoard.body.errors).toBeUndefined()
    expect(getTodoBoard.body.data?.getTodoBoard).toMatchObject(addTodoBoard.body.data?.addTodoBoard)
  })

  test('User cannot read a TodoBoard that user has no permissions to read', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0004',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.errors).toBeUndefined()
    const boardId = addTodoBoard.body.data?.addTodoBoard.board.id
    const { jwt: otherJwt } = await getNewUser()
    const getTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(getTodoBoardQueryData(boardId))
    expect(getTodoBoard.body.errors).toMatchObject([
      {
        message: 'Document with the requested ID could not be found.'
      }
    ])
    expect(getTodoBoard.body.data?.updateBoardName).toBeUndefined()
  })
})