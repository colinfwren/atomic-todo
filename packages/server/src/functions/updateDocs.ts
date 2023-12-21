import {
  BoardNameUpdateInput,
  Todo,
  TodoBoard,
  TodoUpdateInput
} from "../generated/graphql";
import {Databases} from "node-appwrite";
import {TodoBoardDoc, TodoDoc} from "../types";
import { DATABASE_ID, TODO_COL_ID, TODOBOARD_COL_ID } from "../consts";

export async function updateTodoDoc(databases: Databases, todo: TodoUpdateInput): Promise<Todo> {
  const { id, ...values } = todo
  const doc: TodoDoc = await databases.updateDocument(DATABASE_ID, TODO_COL_ID, id, values)
  return {
    id: doc.$id,
    name: doc.name,
    completed: doc.completed,
    deleted: doc.deleted,
    startDate: doc.startDate,
    endDate: doc.endDate,
    showInYear: doc.showInYear,
    showInMonth: doc.showInMonth,
    showInWeek: doc.showInWeek
  }
}

export async function updateTodoBoardDoc(databases: Databases, boardNameUpdate: BoardNameUpdateInput): Promise<TodoBoard> {
  const { id, ...values } = boardNameUpdate
  const boardDoc: TodoBoardDoc = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, id, values)
  return {
    name: boardDoc.name,
    id: boardDoc.$id,
    startDate: boardDoc.startDate
  }
}