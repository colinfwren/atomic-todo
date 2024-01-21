import { createApolloServer } from "../server";
import request from 'supertest'
import {
  getNewUser,
  addTodoBoardMutationData,
  getTodoBoardDetails,
  addTodoMutationData,
  todoPositions,
  getTodoDetails,
  deleteTodoMutationData,
  moveBoardForwardByWeekMutationData,
  moveBoardBackwardByWeekMutationData
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

const MILLISECONDS_IN_DAY = 86400

describe('TodoBoard Start Date Update System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('User moves TodoBoard they have permission to update forward by a week', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0029',
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
    const weeksToAdvance = 5 // needed to ensure Todo will not be found in month list
    for (const _ of Array(weeksToAdvance).fill('a')) {
      await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(moveBoardForwardByWeekMutationData(board.id))
    }
    const moveBoardForward = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(moveBoardForwardByWeekMutationData(board.id))
    expect(moveBoardForward.body.errors).toBeUndefined()
    expect(moveBoardForward.body.data.moveBoardForwardByWeek).toMatchObject({
      board: {
        ...board,
        startDate: board.startDate + ((weeksToAdvance + 1) * (7 * MILLISECONDS_IN_DAY))
      },
      todos: []
    })
  })

  test('User cannot move TodoBoard they do not have permission to update forward by a week', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0030',
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
    const moveBoardForward = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(moveBoardForwardByWeekMutationData(board.id))
     expect(moveBoardForward.body.errors).toMatchObject([
      {
        message: 'Document with the requested ID could not be found.'
      }
    ])
    expect(moveBoardForward.body.data?.moveBoardForwardByWeek).toBeNull()
  })

  test('User moves TodoBoard they have permission to update backward by a week', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0031',
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
    const startDate = new Date(board.startDate * 1000)
    startDate.setMonth(startDate.getMonth() + 5)
    startDate.setDate(1)
    const endDate = (startDate.getTime() / 1000) + MILLISECONDS_IN_DAY
    const addTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoMutationData(board.id, startDate.getTime() / 1000, endDate, todoPositions))
    expect(addTodo.body.errors).toBeUndefined()
    const weeksToAdvance = 5 // needed to ensure Todo will not be found in month list
    for (const _ of Array(weeksToAdvance).fill('a')) {
      await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(moveBoardBackwardByWeekMutationData(board.id))
    }
    const moveBoardBackward = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(moveBoardBackwardByWeekMutationData(board.id))
    expect(moveBoardBackward.body.errors).toBeUndefined()
    expect(moveBoardBackward.body.data.moveBoardBackwardByWeek).toMatchObject({
      board: {
        ...board,
        startDate: board.startDate - ((weeksToAdvance + 1) * (7 * MILLISECONDS_IN_DAY))
      },
      todos: []
    })
  })

  test('User cannot move TodoBoard they do not have permission to update backward by a week', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0032',
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
    const moveBoardBackward = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(moveBoardBackwardByWeekMutationData(board.id))
     expect(moveBoardBackward.body.errors).toMatchObject([
      {
        message: 'Document with the requested ID could not be found.'
      }
    ])
    expect(moveBoardBackward.body.data?.moveBoardBackwardByWeek).toBeNull()
  })
})