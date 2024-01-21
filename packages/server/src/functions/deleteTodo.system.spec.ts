import { createApolloServer } from "../server";
import request from 'supertest'
import {
  getNewUser,
  addTodoBoardMutationData,
  getTodoBoardDetails,
  addTodoMutationData,
  todoPositions, getTodoDetails, deleteTodoMutationData
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

const MILLISECONDS_IN_DAY = 86400

describe('Delete Todo System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Deletes a Todo that user has permissions to delete', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0024',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
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
    const deleteTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(deleteTodoMutationData(board.id, addTodo.body.data.addTodo.todos[0].id))
    expect(deleteTodo.body.errors).toBeUndefined()
    expect(deleteTodo.body.data.deleteTodo).toMatchObject({
      board,
      todos: []
    })
  })

  test('Cannot add a Todo to user\'s account and TodoBoard that user has no permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0025',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
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
    const { jwt: otherJwt } = await getNewUser()
    const deleteTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(deleteTodoMutationData(board.id, addTodo.body.data.addTodo.todos[0].id))
     expect(deleteTodo.body.errors).toMatchObject([
      {
        message: 'The current user is not authorized to perform the requested action.'
      }
    ])
    expect(deleteTodo.body.data?.deleteTodo).toBeNull()
  })
})