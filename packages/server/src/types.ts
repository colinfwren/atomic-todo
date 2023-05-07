import {Databases, Models} from "node-appwrite";
import {Todo, TodoBoard, TodoList} from "./generated/graphql";

export type TodoBoardDoc = Models.Document & TodoBoard
export type TodoListDoc = Models.Document & TodoList
export type TodoDoc = Models.Document & Todo

export type TodoBoardProgressionArgs = {
  databases: Databases,
  boardDoc: TodoBoardDoc,
  newStartDate: Date
}


export enum BoardMoveDirection {
  BACK,
  FORWARD
}

export type GetListMapAndListsToCreateResult = {
  listMap: Map<number, TodoListDoc>,
  listsToCreate: number[]
}