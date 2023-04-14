import {TodoBoard, TodoBoardResult, TodoLevel, TodoList} from "../generated/graphql";
import {Databases, ID, Query} from "node-appwrite";
import {TodoBoardDoc, TodoBoardProgressionArgs, TodoListDoc} from "../types";
import { DATABASE_ID, TODOLIST_COL_ID, TODOBOARD_COL_ID } from "../consts";
import { getTodoBoard } from './getDocs'
import {asyncPipe} from "./utils";

export const DATE_ERROR = 'Invalid Dates provided'
export const FIND_LIST_ERROR = 'Unable to find list'

export async function processMonths({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const currentBoardDate = new Date(boardDoc.startDate)
  if (isNaN(+currentBoardDate) || isNaN(+newStartDate)) throw new Error(DATE_ERROR)
  const monthDelta = newStartDate.getMonth() - currentBoardDate.getMonth()
  if (monthDelta > 0) {
    const monthData: Omit<TodoList, 'id'> = {
      startDate: new Date(newStartDate.getFullYear(), (newStartDate.getMonth() + 6), 1, 0, 0, 0, 0).toISOString(),
      childLists: [],
      todos: [],
      level: TodoLevel.Month
    }
    const newMonth = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), monthData)
    return {
      databases,
      boardDoc: {
        ...boardDoc,
        months: [...boardDoc.months.slice(1, 6), newMonth.$id]
      },
      newStartDate
    }
  }
  return {
    databases,
    boardDoc,
    newStartDate
  }
}

export async function processWeeks({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const currentLastWeekDoc: TodoListDoc = await databases.getDocument(DATABASE_ID, TODOLIST_COL_ID, boardDoc.weeks[5])
  const currentLastWeekDate = new Date(currentLastWeekDoc.startDate)
  if (isNaN(+currentLastWeekDate)) throw new Error(DATE_ERROR)
  const newLastWeekDate = new Date(currentLastWeekDate)
  newLastWeekDate.setDate(newLastWeekDate.getDate() + 7)
  const monthForNewLastWeekDate = new Date(newLastWeekDate)
  monthForNewLastWeekDate.setDate(1)
  const monthForNewLastWeek = await databases.listDocuments(
    DATABASE_ID,
    TODOLIST_COL_ID,
    [
      Query.equal('level', TodoLevel.Month),
      Query.equal('startDate', monthForNewLastWeekDate.toISOString())
    ]
  )
  if (monthForNewLastWeek.total === 0) throw new Error(FIND_LIST_ERROR)
  const newLastWeekData: Omit<TodoList, 'id'> = {
    startDate: newLastWeekDate.toISOString(),
    todos: [],
    childLists: [],
    level: TodoLevel.Week,
    parentList: monthForNewLastWeek.documents[0].$id
  }
  const newLastWeek = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), newLastWeekData)
  return {
    databases,
    boardDoc: {
      ...boardDoc,
        weeks: [ ...boardDoc.weeks.slice(1, 6), newLastWeek.$id]
    },
    newStartDate
  }
}

export async function processDays({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  if (isNaN(+newStartDate)) throw new Error(DATE_ERROR)
  const newDayIds = await Promise.all([0, 1, 2, 3, 4, 5, 6].map(async (daysToAdd) => {
    const newDayDate = new Date(newStartDate)
    newDayDate.setDate(newDayDate.getDate() + daysToAdd)
    const newDayData: Omit<TodoList, 'id'> = {
      startDate: newDayDate.toISOString(),
      todos: [],
      childLists: [],
      parentList: boardDoc.weeks[0],
      level: TodoLevel.Day
    }
    const newDay = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), newDayData)
    return newDay.$id
  }))
  return {
    databases,
    boardDoc:{
    ...boardDoc,
      days: newDayIds
    },
    newStartDate
  }
}

export async function progressBoardByWeek(databases: Databases, boardId: string): Promise<TodoBoardResult> {
  const currentBoardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId)
  const newStartDate = new Date(currentBoardDoc.startDate)
  if (isNaN(+newStartDate)) throw new Error(DATE_ERROR)
  newStartDate.setDate(newStartDate.getDate() + 7)
  const { boardDoc } = await asyncPipe(
    processMonths,
    processWeeks,
    processDays
  )({ databases, boardDoc: currentBoardDoc, newStartDate })
  const newBoardData: Omit<TodoBoard, 'id'> = {
    name: boardDoc.name,
    days: boardDoc.days,
    weeks: boardDoc.weeks,
    months: boardDoc.months,
    startDate: newStartDate.toISOString()
  }
  const updatedBoard = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, newBoardData)
  return getTodoBoard(databases, updatedBoard.$id)
}