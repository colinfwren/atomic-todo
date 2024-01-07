import {Databases} from "node-appwrite";
import {BoardNameUpdateInput, TodoBoard} from "../generated/graphql";
import {TodoBoardDoc} from "../types";
import {DATABASE_ID, TODOBOARD_COL_ID} from "../consts";

export async function updateTodoBoard(databases: Databases, boardNameUpdate: BoardNameUpdateInput): Promise<TodoBoard> {
  const { id, ...values } = boardNameUpdate
  const boardDoc: TodoBoardDoc = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, id, values)
  return {
    name: boardDoc.name,
    id: boardDoc.$id,
    startDate: boardDoc.startDate
  }
}