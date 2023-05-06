import {TodoBoard, TodoBoardResult, TodoLevel, TodoList} from "../generated/graphql";
import {Databases, ID, Query} from "node-appwrite";
import {BoardMoveDirection, TodoBoardDoc, TodoBoardProgressionArgs, TodoListDoc} from "../types";
import {DATABASE_ID, TODOBOARD_COL_ID, TODOLIST_COL_ID} from "../consts";
import {getTodoBoard} from './getDocs'
import {asyncPipe} from "./utils";

export const DATE_ERROR = 'Invalid Dates provided'
export const FIND_LIST_ERROR = 'Unable to find list'

export async function processMonths({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  // Based on newStartDate get next 6 month startdates
  const monthStartDates = [0, 1, 2, 3, 4, 5].map((monthDelta) => {
    const monthDate = new Date(newStartDate)
    monthDate.setMonth(monthDate.getMonth() + monthDelta)
    monthDate.setDate(1)
    return monthDate.getTime() / 1000
  })
  console.log('[processMonth] month start dates', monthStartDates)
  // Search for these
  const existingMonthSearch = await databases.listDocuments(
    DATABASE_ID,
    TODOLIST_COL_ID,
    [
      Query.equal('level', TodoLevel.Month),
      Query.equal('startDate', monthStartDates),
      Query.orderAsc('startDate')
    ]
  )

  console.log('[processMonth] search returned ', existingMonthSearch.total, ' documents')

  if (existingMonthSearch.total === 6) {
    return {
      databases,
      boardDoc: {
        ...boardDoc,
        months: existingMonthSearch.documents.map((doc: TodoListDoc) => doc.$id)
      },
      newStartDate
    }
  }
  // Create a list of month lists to create
  const monthMap = new Map<number, TodoListDoc>(existingMonthSearch.documents.map((doc: TodoListDoc) => [doc.startDate, doc]))
  const existingMonthStartDates = [...monthMap.keys()]
  const monthsToCreate = monthStartDates.reduce((months: number[], month: number) => {
    if (!existingMonthStartDates.includes(month)) {
      return [...months, month]
    }
    return months
  }, [])
  // Create the months lists to create
  const createdMonths = await Promise.all(monthsToCreate.map(async (startDate: number) => {
    const monthData: Omit<TodoList, 'id'> = {
      startDate,
      childLists: [],
      todos: [],
      level: TodoLevel.Month
    }
    console.log('[processMonth] creating new month list', monthData.startDate)
    return await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), monthData)
  }))
  // return the months array
  createdMonths.map((doc: TodoListDoc) => {
    monthMap.set(doc.startDate, doc)
  })

  return {
    databases,
    boardDoc: {
      ...boardDoc,
      months: [...monthMap.values()].sort((a, b) => a.startDate - b.startDate).map((doc: TodoListDoc) => doc.$id)
    },
    newStartDate
  }
}

export async function processWeeks({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {

  // get a list of each startdate for the weeks
  const weekStartDates = [0, 7, 14, 21, 28, 35].map((weekDelta) => {
    const weekStartDate = new Date(newStartDate)
    weekStartDate.setDate(weekStartDate.getDate() + weekDelta)
    return weekStartDate.getTime() / 1000
  })

  console.log('startDates', weekStartDates)
  // Check to see if the weeks are already created
  const existingWeekSearch = await databases.listDocuments(
    DATABASE_ID,
    TODOLIST_COL_ID,
    [
      Query.equal('level', TodoLevel.Week),
      Query.equal('startDate', weekStartDates),
      Query.orderAsc('startDate')
    ]
  )

  // if so return
  if (existingWeekSearch.total === 6) {
    return {
      databases,
      boardDoc: {
        ...boardDoc,
        weeks: existingWeekSearch.documents.map((doc: TodoListDoc) => doc.$id)
      },
      newStartDate
    }
  }

  // if not then create teh missing ones
  const weekMap = new Map<number, TodoListDoc>(existingWeekSearch.documents.map((doc: TodoListDoc) => [doc.startDate, doc]))
  const existingWeekStartDates = [...weekMap.keys()]
  const weeksToCreate = weekStartDates.reduce((weeks: number[], week: number) => {
    if (!existingWeekStartDates.includes(week)) {
      return [...weeks, week]
    }
    return weeks
  }, [])
  // Create the months lists to create
  const createdWeeks = await Promise.all(weeksToCreate.map(async (startDate: number) => {
    const monthForWeekDate = new Date(startDate * 1000)
    monthForWeekDate.setDate(1)
    const monthForWeek = await databases.listDocuments(
      DATABASE_ID,
      TODOLIST_COL_ID,
      [
        Query.equal('level', TodoLevel.Month),
        Query.equal('startDate', monthForWeekDate.getTime() / 1000)
      ]
    )
    if (monthForWeek.total === 0) throw new Error(FIND_LIST_ERROR)

    const weekData: Omit<TodoList, 'id'> = {
      startDate,
      childLists: [],
      todos: [],
      level: TodoLevel.Week,
      parentList: monthForWeek.documents[0].$id
    }
    console.log('[processMonth] creating new week list', weekData.startDate)
    return await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), weekData)
  }))
  // return the months array
  createdWeeks.map((doc: TodoListDoc) => {
    weekMap.set(doc.startDate, doc)
  })

  return {
    databases,
    boardDoc: {
      ...boardDoc,
      weeks: [...weekMap.values()].sort((a, b) => a.startDate - b.startDate).map((doc: TodoListDoc) => doc.$id)
    },
    newStartDate
  }
}

export async function processDays({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const newDayIds = await Promise.all([0, 1, 2, 3, 4, 5, 6].map(async (daysToAdd) => {
    const newDayDate = new Date(newStartDate)
    newDayDate.setDate(newDayDate.getDate() + daysToAdd)
    const newDayData: Omit<TodoList, 'id'> = {
      startDate: newDayDate.getTime() / 1000,
      todos: [],
      childLists: [],
      parentList: boardDoc.weeks[0],
      level: TodoLevel.Day
    }
    console.log('[processDays] creating new day list', newDayData.startDate)
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

export async function moveBoardByWeek(databases: Databases, boardId: string, direction: BoardMoveDirection = BoardMoveDirection.FORWARD): Promise<TodoBoardResult> {
  const currentBoardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId)
  const newStartDate = new Date((currentBoardDoc.startDate * 1000))
  if (isNaN(+newStartDate)) throw new Error(DATE_ERROR)
  if (direction === BoardMoveDirection.FORWARD) {
    newStartDate.setDate(newStartDate.getDate() + 7)
  } else {
    newStartDate.setDate(newStartDate.getDate() - 7)
  }
  const { boardDoc } = await asyncPipe(
    processMonths,
    processWeeks,
    processDays,
    // something to ensure the child parent links are set properly
  )({ databases, boardDoc: currentBoardDoc, newStartDate })
  const newBoardData: Omit<TodoBoard, 'id'> = {
    name: boardDoc.name,
    days: boardDoc.days,
    weeks: boardDoc.weeks,
    months: boardDoc.months,
    startDate: newStartDate.getTime() / 1000
  }
  const updatedBoard = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, newBoardData)
  return getTodoBoard(databases, updatedBoard.$id)
}
