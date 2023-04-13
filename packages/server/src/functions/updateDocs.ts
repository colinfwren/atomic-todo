import {Todo, TodoList, TodoListUpdateInput, TodoUpdateInput} from "../generated/graphql";
import {Databases} from "node-appwrite";
import { TodoDoc, TodoListDoc } from "../types";
import { DATABASE_ID, TODOLIST_COL_ID, TODO_COL_ID } from "../consts";

export async function updateTodoListDoc(databases: Databases, todoList: TodoListUpdateInput): Promise<TodoList> {
  const { id, ...values } = todoList
  const doc: TodoListDoc = await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, id, values)
  return {
    id: doc.$id,
    level: doc.level,
    todos: doc.todos,
    parentList: doc.parentList,
    childLists: doc.childLists,
    startDate: doc.startDate
  }
}

export async function updateTodoDoc(databases: Databases, todo: TodoUpdateInput): Promise<Todo> {
  const { id, ...values } = todo
  const doc: TodoDoc = await databases.updateDocument(DATABASE_ID, TODO_COL_ID, id, values)
  return {
    id: doc.$id,
    name: doc.name,
    completed: doc.completed
  }
}