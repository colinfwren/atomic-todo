import {Models} from "node-appwrite";
import {Todo, TodoBoard} from "./generated/graphql";

export type TodoBoardDoc = Models.Document & TodoBoard & { todos: TodoDoc[] }
export type TodoDoc = Models.Document & Todo


export enum BoardMoveDirection {
  BACK,
  FORWARD
}
