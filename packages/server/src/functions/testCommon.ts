import {TodoBoard, TodoLevel} from "../generated/graphql";
import {TodoBoardDoc, TodoListDoc} from "../types";

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

export const mockBoardDoc: TodoBoardDoc = {
  ...docAttrs,
  name: 'Todo Board',
  startDate: 1680476400,
  id: docAttrs.$id,
  days: Array(7).fill(0).map( (x, i) => `day-list-${i}`),
  weeks: Array(6).fill(0).map( (x, i) => `week-list-${i}`),
  months: Array(6).fill(0).map( (x, i) => `month-list-${i}`)
}