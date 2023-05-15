import {TodoBoardResult} from "../generated/graphql";
import {Databases, Query} from "node-appwrite";
import { TodoBoardDoc, TodoListDoc, TodoDoc } from "../types";
import { DATABASE_ID, TODOLIST_COL_ID, TODO_COL_ID, TODOBOARD_COL_ID } from "../consts";

export async function getTodoBoard(databases: Databases, id: string): Promise<TodoBoardResult> {
  const boardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, id)
  const listDocs = await databases.listDocuments(DATABASE_ID, TODOLIST_COL_ID, [Query.equal('$id', [ ...boardDoc.days, ...boardDoc.weeks, ...boardDoc.months])])
  const lists = listDocs.documents.map((doc: TodoListDoc) => {
    return {
      id: doc.$id,
      level: doc.level,
      todos: doc.todos,
      parentList: doc.parentList,
      childLists: doc.childLists,
      startDate: doc.startDate
    }
  })
  const todoIds = listDocs.documents.reduce((todoIds: Set<string>, doc: TodoListDoc) => {
    return new Set([...todoIds, ...doc.todos])
  }, new Set())
  if (todoIds.size < 1) {
    return {
       board: {
      name: boardDoc.name,
      days: boardDoc.days,
      weeks: boardDoc.weeks,
      months: boardDoc.months,
      id: boardDoc.$id,
      startDate: boardDoc.startDate
    },
    lists,
    todos: []
    }
  }
  const todoDocs = await databases.listDocuments(DATABASE_ID, TODO_COL_ID, [Query.equal('$id', [...todoIds])])
  const todos = todoDocs.documents.map((doc: TodoDoc) => {
    return {
      id: doc.$id,
      name: doc.name,
      completed: doc.completed === null ? false : doc.completed,
      deleted: doc.deleted
    }
  })
  return {
    board: {
      name: boardDoc.name,
      days: boardDoc.days,
      weeks: boardDoc.weeks,
      months: boardDoc.months,
      id: boardDoc.$id,
      startDate: boardDoc.startDate
    },
    lists,
    todos
  }
}