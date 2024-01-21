import {TodoBoard } from "../generated/graphql";
import { Databases } from "node-appwrite";
import { TodoBoardDoc } from "../types";
import { DATABASE_ID, TODOBOARD_COL_ID } from "../consts";

export async function getTodoBoards(databases: Databases): Promise<TodoBoard[]> {
  const boards = await databases.listDocuments(DATABASE_ID, TODOBOARD_COL_ID)
  return boards.documents.map((doc: TodoBoardDoc) => ({
    id: doc.$id,
    name: doc.name,
    startDate: doc.startDate
  }))
}