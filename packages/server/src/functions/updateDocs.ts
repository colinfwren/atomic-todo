import {
  BoardNameUpdateInput,
  Todo,
  TodoBoard,
  TodoList,
  TodoListUpdateInput,
  TodoUpdateInput
} from "../generated/graphql";
import {Databases} from "node-appwrite";
import {TodoBoardDoc, TodoDoc, TodoListDoc} from "../types";
import { DATABASE_ID, TODOLIST_COL_ID, TODO_COL_ID, TODOBOARD_COL_ID } from "../consts";

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

export async function updateTodoBoardDoc(databases: Databases, boardNameUpdate: BoardNameUpdateInput): Promise<TodoBoard> {
  const { id, ...values } = boardNameUpdate
  const boardDoc: TodoBoardDoc = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, id, values)
  return {
    name: boardDoc.name,
    days: boardDoc.days,
    weeks: boardDoc.weeks,
    months: boardDoc.months,
    id: boardDoc.$id,
    startDate: boardDoc.startDate
  }
}