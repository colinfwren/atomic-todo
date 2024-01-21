import {Databases,} from "node-appwrite";
import {TodoBoardResult} from "../generated/graphql";
import {DATABASE_ID, TODO_COL_ID} from "../consts";
import {getTodoBoard} from "./getTodoBoard";

export async function deleteTodo(databases: Databases, boardId: string, todoId: string): Promise<TodoBoardResult> {
  await databases.updateDocument(DATABASE_ID, TODO_COL_ID, todoId, { deleted: true })
  return getTodoBoard(databases, boardId)
}