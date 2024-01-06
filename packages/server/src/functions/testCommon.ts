import {TodoBoard} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc} from "../types";
import {Models} from "node-appwrite";

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