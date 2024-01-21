import {TodoBoard, TodoLevel, TodoPositionInput, TodoUpdateInput} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc} from "../types";
import {Client, Databases, ID, Models, Users} from "node-appwrite";
import {randomUUID} from "node:crypto";
import request from 'supertest'
import {DATABASE_ID, TODO_COL_ID, TODOBOARD_COL_ID} from "../consts";

const APPWRITE_URL = 'http://localhost/v1'
const APPWRITE_PROJECT = 'atomic-todo'
const APPWRITE_API_KEY = '5de9dc03ce6bc714afe1a3d87b1a7829eedfc0bab61f75589287fe04dad9f5203e4d39218c71e2fd67dabcbcfa512670bf769ddfa0e4182c0b9c863b4ff1936237581040f34b7a179cbbeee64c9f1e5b1c68798d096a0de6969df3e4ed067bee9db56f8ae244ea4196d502413473443f946eccb712e8d5ce10fa1afe959e72a1'
const NEW_USER_PASSWORD = 'correctHorseBatteryStaple'

export const TODO_ID = 'dead-beef'
export const BOARD_ID = 'board'
export const TODO_START_DATE = 1735516800
export const TODO_END_DATE = 1736121600

export const docAttrs = {
  $id: 'dead-beef',
  $updatedAt: '',
  $permissions: [],
  $collectionId: '',
  $createdAt: '',
  $databaseId: '',
}

export const errorMessage = 'Oh Noes'

export const board: TodoBoard = {
  name: 'Good Board',
  startDate: 568965600000,
  id: docAttrs.$id,
}

export const mockTodoDoc: TodoDoc = {
  ...docAttrs,
  id: docAttrs.$id,
  name: 'Foo',
  completed: false,
  deleted: false,
  startDate: TODO_START_DATE,
  endDate: TODO_END_DATE,
  showInYear: true,
  showInMonth: true,
  showInWeek: true,
  posInYear: 0,
  posInMonth: 0,
  posInWeek: 0,
  posInDay: 0
}

export const mockBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Todo Board',
  startDate: 1680476400000,
  id: docAttrs.$id,
  todos: []
}

export const USER: Models.User<Models.Preferences> = {
  $createdAt: "",
  $updatedAt: "",
  accessedAt: "",
  email: "test@test.com",
  emailVerification: false,
  labels: [],
  name: "Test User",
  passwordUpdate: "",
  phone: "",
  phoneVerification: false,
  prefs: undefined,
  registration: "",
  status: false,
  $id: 'userId'
}

export const todoPositions: TodoPositionInput[] = [
  {
    granularity: TodoLevel.Month,
    position: 1
  },
  {
    granularity: TodoLevel.Week,
    position: 2
  },
  {
    granularity: TodoLevel.Day,
    position: 3
  }
]

export async function getTodoDetails(todoId: string): Promise<TodoDoc> {
  const client = new Client()
    .setEndpoint(APPWRITE_URL)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_API_KEY)
  const databases = new Databases(client)
  return databases.getDocument(DATABASE_ID, TODO_COL_ID, todoId)
}

export async function getTodoBoardDetails(todoBoardId: string): Promise<TodoBoardDoc> {
  const client = new Client()
  .setEndpoint(APPWRITE_URL)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY)
  const databases = new Databases(client)
  return databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, todoBoardId)
}

export async function getNewUser(): Promise<{ user: Models.User<Models.Preferences>, jwt: string}> {
  const client = new Client()
  .setEndpoint(APPWRITE_URL)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY)
  const users = new Users(client)
  const userEmail = `test-user-${randomUUID()}@test.com`
  const user = await users.create(ID.unique(), userEmail, undefined, NEW_USER_PASSWORD, userEmail)
  const agent = request.agent(APPWRITE_URL)
    await agent
      .post('/account/sessions/email')
      .set('X-Appwrite-Response-Format', '1.4.0')
      .set('X-Appwrite-Project', APPWRITE_PROJECT)
      .send({
        'email': userEmail,
        'password': NEW_USER_PASSWORD
      })
    const jwtResponse = await agent
      .post('/account/jwt')
      .set('X-Appwrite-Response-Format', '1.4.0')
      .set('X-Appwrite-Project', APPWRITE_PROJECT)
    return {
      user,
      jwt: jwtResponse.body?.jwt
    }
}

export const GET_TODOBOARDS_QUERY = `
query getTodoBoards {
  getTodoBoards {
    id
    name
    startDate
  }
}
`

export const getTodoBoardsQueryData = {
  query: GET_TODOBOARDS_QUERY
}

export const ADD_TODOBOARDS_MUTATION  = `
mutation addTodoBoard {
  addTodoBoard {
    board {
      id
      name
      startDate
    }
    todos {
      id
    }  
  }
}
`

export const addTodoBoardMutationData = {
  query: ADD_TODOBOARDS_MUTATION
}

export const UPDATE_TODOBOARD_NAME_MUTATION = `
mutation UpdateBoardName($boardNameUpdate: BoardNameUpdateInput!) {
  updateBoardName(boardNameUpdate: $boardNameUpdate) {
    name
  }
}
`

export function updateTodoBoardNameMutationData(boardId: string, name: string) {
  return  {
    query: UPDATE_TODOBOARD_NAME_MUTATION,
    variables: {
      boardNameUpdate: {
        id: boardId,
        name
      }
    }
  }
}

export const GET_TODOBOARD_QUERY = `
query GetTodoBoard($id: ID!) {
  getTodoBoard(id: $id) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      deleted
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
      posInYear
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

export function getTodoBoardQueryData(boardId: string) {
  return {
    query: GET_TODOBOARD_QUERY,
    variables: {
      id: boardId
    }
  }
}

export const ADD_TODO = `
mutation AddTodo($boardId: ID!, $startDate: Int!, $endDate: Int!, $positions: [TodoPositionInput]!) {
  addTodo(boardId: $boardId, startDate: $startDate, endDate: $endDate, positions: $positions) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      deleted
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
      posInYear
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

export function addTodoMutationData(boardId: string, startDate: number, endDate: number, positions: TodoPositionInput[]) {
  return {
    query: ADD_TODO,
    variables: {
      boardId,
      startDate,
      endDate,
      positions
    }
  }
}

export const UPDATE_TODO = `
mutation UpdateTodo($todo: TodoUpdateInput!) {
  updateTodo(todo: $todo) {
    id
    name
    completed
    deleted
    startDate
    endDate
    showInYear
    showInMonth
    showInWeek
    posInYear
    posInMonth
    posInWeek
    posInDay
  }
}
`

export function updateTodoMutationData(todo: TodoUpdateInput) {
  return {
    query: UPDATE_TODO,
    variables: {
      todo
    }
  }
}

export const UPDATE_TODOS = `
mutation UpdateTodos($todos: [TodoUpdateInput!]!) {
  updateTodos(todos: $todos) {
    id
    name
    completed
    deleted
    startDate
    endDate
    showInYear
    showInMonth
    showInWeek
    posInYear
    posInMonth
    posInWeek
    posInDay
  }
}
`

export function updateTodosMutationData(todos: TodoUpdateInput[]) {
  return {
    query: UPDATE_TODOS,
    variables: {
      todos
    }
  }
}

export const DELETE_TODO = `
mutation DeleteTodo($boardId: ID!, $todoId: ID!) {
  deleteTodo(boardId: $boardId, todoId: $todoId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      deleted
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
      posInYear
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

export function deleteTodoMutationData(boardId: string, todoId: string) {
  return {
    query: DELETE_TODO,
    variables: {
      boardId,
      todoId
    }
  }
}

export const MOVE_BOARD_FORWARD = `
mutation MoveBoardForwardByWeek($boardId: ID!) {
  moveBoardForwardByWeek(boardId: $boardId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      deleted
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
      posInYear
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

export function moveBoardForwardByWeekMutationData(boardId: string) {
  return {
    query: MOVE_BOARD_FORWARD,
    variables: {
      boardId
    }
  }
}

export const MOVE_BOARD_BACKWARD = `
mutation MoveBoardBackwardByWeek($boardId: ID!) {
  moveBoardBackwardByWeek(boardId: $boardId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      deleted
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
      posInYear
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

export function moveBoardBackwardByWeekMutationData(boardId: string) {
  return {
    query: MOVE_BOARD_BACKWARD,
    variables: {
      boardId
    }
  }
}