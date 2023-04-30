import {TodoBoard} from "../generated/graphql";

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
  startDate: '',
  id: docAttrs.$id,
  days: Array(7).fill(0).map( x => 'good_lists'),
  weeks: Array(6).fill(0).map( x => 'good_lists'),
  months: Array(6).fill(0).map( x => 'good_lists')
}