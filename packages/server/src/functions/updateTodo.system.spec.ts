import { createApolloServer } from "../server";
import request from 'supertest'
import {
  getNewUser,
  addTodoBoardMutationData,
  getTodoBoardDetails,
  addTodoMutationData,
  todoPositions, getTodoDetails, deleteTodoMutationData, updateTodoMutationData
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

const MILLISECONDS_IN_DAY = 86400

describe('Update Todo System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Updates Todo name for a Todo that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0017',
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
    const { posInYear, deleted, ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      name: 'Updated Todo Name'
    }
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoMutationData(updatedTodo))
    expect(updateTodo.body.errors).toBeUndefined()
    expect(updateTodo.body.data.updateTodo).toMatchObject({
      ...updatedTodo,
      posInYear,
      deleted
    })
  })

  test('Updates Todo completion for a Todo that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0020',
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
    const { posInYear, deleted,  ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      completed: true
    }
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoMutationData(updatedTodo))
    expect(updateTodo.body.errors).toBeUndefined()
    expect(updateTodo.body.data.updateTodo).toMatchObject(updatedTodo)
  })

  test('Updates Todo visibility for a Todo that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0021',
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
    const { posInYear, deleted, ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      showInMonth: false
    }
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoMutationData(updatedTodo))
    expect(updateTodo.body.errors).toBeUndefined()
    expect(updateTodo.body.data.updateTodo).toMatchObject(updatedTodo)
  })

  test('Updates Todo position in list for a Todo that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0022',
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
    const { posInYear, deleted, ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      posInMonth: 1337
    }
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoMutationData(updatedTodo))
    expect(updateTodo.body.errors).toBeUndefined()
    expect(updateTodo.body.data.updateTodo).toMatchObject(updatedTodo)
  })

  test('Updates Todo start and end date for a Todo that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0023',
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
    const { posInYear, deleted, ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      startDate: endDate,
      endDate: endDate + MILLISECONDS_IN_DAY
    }
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodoMutationData(updatedTodo))
    expect(updateTodo.body.errors).toBeUndefined()
    expect(updateTodo.body.data.updateTodo).toMatchObject(updatedTodo)
  })

  test('Cannot update a Todo that user has no permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0018',
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
    const { posInYear, deleted, ...todo} = addTodo.body.data.addTodo.todos[0]
    const updatedTodo = {
      ...todo,
      startDate: endDate,
      endDate: endDate + MILLISECONDS_IN_DAY
    }
    const { jwt: otherJwt } = await getNewUser()
    const updateTodo = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(updateTodoMutationData(updatedTodo))
     expect(updateTodo.body.errors).toMatchObject([
      {
        message: 'The current user is not authorized to perform the requested action.'
      }
    ])
    expect(updateTodo.body.data?.updateTodo).toBeNull()
  })
})