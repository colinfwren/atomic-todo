import {TodoBoardResult} from "../generated/graphql";
import {Databases, ID} from "node-appwrite";
import {DATABASE_ID, TODO_COL_ID, TODOLIST_COL_ID} from "../consts";
import {TodoListDoc} from "../types";
import {getTodoBoard} from "./getDocs";

export async function addToListAndParents(databases: Databases, todoId: string, listId: string | undefined): Promise<void> {
  if (typeof listId === 'string') {
    const list = await databases.getDocument(DATABASE_ID, TODOLIST_COL_ID, listId) as TodoListDoc
    await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, list.$id, { todos: [...list.todos, todoId]})
    if (typeof list.parentList === 'string' ) {
      await addToListAndParents(databases, todoId, list.parentList)
    }
  }
}

export async function addTodo(databases: Databases, boardId: string, listId: string): Promise<TodoBoardResult> {
  const newTodo = await databases.createDocument(DATABASE_ID, TODO_COL_ID, ID.unique(), {
    name: 'New Todo',
    completed: false
  })
  await addToListAndParents(databases, newTodo.$id, listId)
  return getTodoBoard(databases, boardId)
}