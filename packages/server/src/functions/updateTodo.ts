import {
  Todo,
  TodoUpdateInput
} from "../generated/graphql";
import {Databases} from "node-appwrite";
import {TodoDoc} from "../types";
import { DATABASE_ID, TODO_COL_ID } from "../consts";

export async function updateTodo(databases: Databases, todo: TodoUpdateInput): Promise<Todo> {
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
    showInWeek: doc.showInWeek,
    posInYear: doc.posInYear,
    posInMonth: doc.posInMonth,
    posInWeek: doc.posInWeek,
    posInDay: doc.posInDay
  }
}

