import {Databases, Query} from "node-appwrite";
import {TodoBoardResult} from "../generated/graphql";
import {DATABASE_ID, TODO_COL_ID, TODOLIST_COL_ID} from "../consts";
import {TodoListDoc} from "../types";
import {getTodoBoard} from "./getDocs";

export async function deleteTodo(databases: Databases, boardId: string, todoId: string): Promise<TodoBoardResult> {
  await databases.updateDocument(DATABASE_ID, TODO_COL_ID, todoId, { deleted: true })
  const listWithTodoQuery = await databases.listDocuments(DATABASE_ID, TODOLIST_COL_ID, [
    Query.search('todos', todoId)
  ])
  if(listWithTodoQuery.total > 0) {
    await Promise.all(listWithTodoQuery.documents.map(async (listDoc: TodoListDoc) => {
      await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, listDoc.$id, { todos: listDoc.todos.filter((tId) => tId !== todoId)})
    }))
  }
  return getTodoBoard(databases, boardId)

}