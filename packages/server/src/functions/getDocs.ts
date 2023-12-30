import {TodoBoardResult} from "../generated/graphql";
import {Databases, Query} from "node-appwrite";
import { TodoBoardDoc, TodoDoc } from "../types";
import { DATABASE_ID, TODO_COL_ID, TODOBOARD_COL_ID } from "../consts";

export function getQueryDates(boardStartDate: number): Record<string, number> {
  const startDate = new Date(boardStartDate * 1000)
  startDate.setDate(1)
  startDate.setHours(0)
  startDate.setMinutes(0)
  startDate.setSeconds(0)
  startDate.setMilliseconds(0)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 6)
  return {
    queryStartDate: startDate.getTime() / 1000,
    queryEndDate: endDate.getTime() / 1000
  }
}

export async function getTodoBoard(databases: Databases, id: string): Promise<TodoBoardResult> {
  const boardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, id)
  const { queryStartDate, queryEndDate } = getQueryDates(boardDoc.startDate)
  const todos = boardDoc.todos.filter((todo) => todo.startDate >= queryStartDate && todo.endDate <= queryEndDate && !todo.deleted)
  return {
    board: {
      name: boardDoc.name,
      id: boardDoc.$id,
      startDate: boardDoc.startDate
    },
    todos: todos.map((doc: TodoDoc) => {
    return {
      id: doc.$id,
      name: doc.name,
      completed: doc.completed,
      startDate: doc.startDate,
      endDate: doc.endDate,
      showInYear: doc.showInYear,
      showInMonth: doc.showInMonth,
      showInWeek: doc.showInWeek,
      posInYear: doc.posInYear,
      posInMonth: doc.posInMonth,
      posInWeek: doc.posInWeek,
      posInDay: doc.posInDay,
      deleted: false
    }
  })
  }
}