import {Models} from "node-appwrite";
import {Todo, TodoBoard} from "./generated/graphql";
import {AtomicTodoJestApi} from "@atomic-todo/test-reporter/dist/AtomicTodoJestApi";

export type TodoBoardDoc = Models.Document & TodoBoard & { todos: TodoDoc[] }
export type TodoDoc = Models.Document & Todo


export enum BoardMoveDirection {
  BACK,
  FORWARD
}

declare global {
  const atomicTodoTestReporter: AtomicTodoJestApi
}