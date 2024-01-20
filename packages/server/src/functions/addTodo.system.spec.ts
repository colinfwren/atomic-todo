import { createApolloServer } from "../server";
import request from 'supertest'
import {
  getNewUser,
  addTodoBoardMutationData,
  getTodoBoardDetails,
  addTodoMutationData,
  todoPositions, getTodoDetails
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

const MILLISECONDS_IN_DAY = 86400

describe('Adding Todo System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Adds a Todo to user\'s account and TodoBoard that user has permissions to update and sets permissions correctly on Todo', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0014',
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
    const board = addTodoBoard.body.data.addTodoBoard.board
    const startDate = board.startDate + MILLISECONDS_IN_DAY
    const endDate = startDate + MILLISECONDS_IN_DAY
    const addTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoMutationData(board.id, startDate, endDate, todoPositions))
    expect(addTodo.body.errors).toBeUndefined()
    expect(addTodo.body.data.addTodo).toMatchObject({
      board,
      todos: [
        {
          name: 'New Todo',
          completed: false,
          deleted: false,
          startDate,
          endDate,
          showInYear: true,
          showInMonth: true,
          showInWeek: true,
          posInYear: 0,
          posInMonth: todoPositions[0].position,
          posInWeek: todoPositions[1].position,
          posInDay: todoPositions[2].position
        }
      ]
    })
    const createdTodo = await getTodoDetails(addTodo.body.data?.addTodo.todos[0].id)
    expect(createdTodo.$permissions).toMatchObject([
      `read("user:${user.$id}")`,
      `update("user:${user.$id}")`,
      `delete("user:${user.$id}")`
    ])
  })

  test('Cannot add a Todo to user\'s account and TodoBoard that user has no permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0016',
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
    const board = addTodoBoard.body.data.addTodoBoard.board
    const startDate = board.startDate + MILLISECONDS_IN_DAY
    const endDate = startDate + MILLISECONDS_IN_DAY
    const { jwt: otherJwt } = await getNewUser()
    const addTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(addTodoMutationData(board.id, startDate, endDate, todoPositions))
     expect(addTodo.body.errors).toMatchObject([
      {
        message: 'Document with the requested ID could not be found.'
      }
    ])
    expect(addTodo.body.data?.addTodo).toBeNull()
  })
})