import {TodoBoardResult} from "../generated/graphql";
import {Databases, ID} from "node-appwrite";
import {DATABASE_ID, TODO_COL_ID} from "../consts";
import {getTodoBoard} from "./getDocs";

export async function addTodo(databases: Databases, boardId: string, startDate: number, endDate: number): Promise<TodoBoardResult> {
  await databases.createDocument(DATABASE_ID, TODO_COL_ID, ID.unique(), {
    name: 'New Todo',
    completed: false,
    startDate: startDate,
    endDate: endDate,
    showInYear: true,
    showInMonth: true,
    showInWeek: true
  })
  return getTodoBoard(databases, boardId)
}