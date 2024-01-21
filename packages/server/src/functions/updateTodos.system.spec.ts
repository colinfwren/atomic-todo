import { createApolloServer } from "../server";
import request from 'supertest'
import {
  getNewUser,
  addTodoBoardMutationData,
  getTodoBoardDetails,
  addTodoMutationData,
  todoPositions, getTodoDetails, deleteTodoMutationData, updateTodoMutationData, updateTodosMutationData
} from "./testCommon";
import {TestType} from "@atomic-todo/test-reporter";

const MILLISECONDS_IN_DAY = 86400

describe('Update multiple Todo System Tests', () => {
  let server, url;

  beforeAll(async () => {
    ({ server, url } = await createApolloServer({ port: 0 }))
  })

  afterAll(async () => {
    await server?.stop()
  })

  test('Updates multiple Todos that user has permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0027',
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
    const addTodo1 = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoMutationData(board.id, startDate, endDate, todoPositions))
    expect(addTodo1.body.errors).toBeUndefined()
    const todo2Positions = todoPositions.map((todoPosition) => ({ ...todoPosition, position: todoPosition.position + 1}))
    const addTodo2 = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoMutationData(board.id, startDate, endDate, todo2Positions))
    expect(addTodo1.body.errors).toBeUndefined()
    const { posInYear, deleted, ...todo1} = addTodo1.body.data.addTodo.todos[0]
    const { posInYear: posInYear2, deleted: deleted2, ...todo2} = addTodo2.body.data.addTodo.todos[0]
    const updatedTodo1 = {
      ...todo1,
      posInMonth: todo2Positions[0].position
    }
    const updatedTodo2 = {
      ...todo2,
      posInMonth: todoPositions[0].position
    }
    const updateTodos = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodosMutationData([updatedTodo1, updatedTodo2]))
    expect(updateTodos.body.errors).toBeUndefined()
    expect(updateTodos.body.data.updateTodos).toMatchObject([updatedTodo1, updatedTodo2])
  })

  test.skip('Cannot update a Todo that user has no permissions to update', async () => {
    atomicTodoTestReporter.metaData({
      testCaseId: 'TC-0028',
      testType: TestType.SYSTEM
    })
    const { jwt } = await getNewUser()
    const { jwt: otherJwt } = await getNewUser()
    const addTodoBoard = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard.body.errors).toBeUndefined()
    const addTodoBoard2 = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(addTodoBoardMutationData)
    expect(addTodoBoard2.body.errors).toBeUndefined()
    const board = addTodoBoard.body.data.addTodoBoard.board
    const board2 = addTodoBoard2.body.data.addTodoBoard.board
    const startDate = board.startDate + MILLISECONDS_IN_DAY
    const endDate = startDate + MILLISECONDS_IN_DAY
    const addTodo1 = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(addTodoMutationData(board.id, startDate, endDate, todoPositions))
    expect(addTodo1.body.errors).toBeUndefined()
    const addTodo2 = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${otherJwt}`)
      .send(addTodoMutationData(board2.id, startDate, endDate, todoPositions))
    const { posInYear, deleted, ...todo1} = addTodo1.body.data.addTodo.todos[0]
    const { posInYear: posInYear2, deleted: deleted2, ...todo2} = addTodo2.body.data.addTodo.todos[0]
    const todo2Positions = todoPositions.map((todoPosition) => ({ ...todoPosition, position: todoPosition.position + 1}))
    const updatedTodo1 = {
      ...todo1,
      posInMonth: todo2Positions[0].position
    }
    const updatedTodo2 = {
      ...todo2,
      posInMonth: todoPositions[0].position
    }
    const updateTodos = await request(url)
      .post('/')
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateTodosMutationData([updatedTodo1, updatedTodo2]))
     expect(updateTodos.body.errors).toMatchObject([
      {
        message: 'The current user is not authorized to perform the requested action.'
      }
    ])
    expect(updateTodos.body.data?.updateTodos).toBeUndefined()
  })
})