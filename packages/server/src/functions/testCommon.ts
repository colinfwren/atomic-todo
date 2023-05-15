import {TodoBoard, TodoLevel} from "../generated/graphql";
import {TodoBoardDoc, TodoDoc, TodoListDoc} from "../types";

export const TODO_ID = 'dead-beef'
export const LIST_ID = 'beef-dead'
export const MONTH_ID = 'month'
export const WEEK_ID = 'week'
export const DAY_ID = 'day'
export const BOARD_ID = 'board'

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
  startDate: 568965600,
  id: docAttrs.$id,
  days: Array(7).fill(0).map( x => 'good_lists'),
  weeks: Array(6).fill(0).map( x => 'good_lists'),
  months: Array(6).fill(0).map( x => 'good_lists')
}

export const mockListDoc: TodoListDoc = {
  ...docAttrs,
  id: docAttrs.$id,
  childLists: [],
  parentList: undefined,
  level: TodoLevel.Day,
  startDate: 1683500400,
  todos: ['bad_todos']
}

export const mockTodoDoc: TodoDoc = {
  ...docAttrs,
  id: docAttrs.$id,
  name: 'Foo',
  completed: false,
  deleted: false,
}

export const mockBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Todo Board',
  startDate: 1680476400,
  id: docAttrs.$id,
  days: Array(7).fill(0).map( (x, i) => `day-list-${i}`),
  weeks: Array(6).fill(0).map( (x, i) => `week-list-${i}`),
  months: Array(6).fill(0).map( (x, i) => `month-list-${i}`)
}

export const MONTH_LIST = {
  ...mockListDoc,
  $id: MONTH_ID,
  id: MONTH_ID
}

export const WEEK_LIST = {
  ...mockListDoc,
  $id: WEEK_ID,
  id: WEEK_ID,
  parentList: MONTH_ID
}

export const DAY_LIST = {
  ...mockListDoc,
  $id: DAY_ID,
  id: DAY_ID,
  parentList: WEEK_ID
}