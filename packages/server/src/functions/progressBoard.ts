import {TodoBoard, TodoBoardResult, TodoLevel, TodoList} from "../generated/graphql";
import {Databases, ID, Query, Models} from "node-appwrite";
import {
  BoardMoveDirection,
  GetListMapAndListsToCreateResult,
  TodoBoardDoc,
  TodoBoardProgressionArgs,
  TodoListDoc
} from "../types";
import {DATABASE_ID, TODOBOARD_COL_ID, TODOLIST_COL_ID} from "../consts";
import {getTodoBoard} from './getDocs'
import {asyncPipe, convertDateToUTC} from "./utils";

export const DATE_ERROR = 'Invalid Dates provided'
export const FIND_LIST_ERROR = 'Unable to find list'
export const LIST_UPDATE_ERROR = 'Unable to update list'

export function getNextSixMonths(startDate: Date) {
  return [0, 1, 2, 3, 4, 5].map((monthsToAdd) => {
    const monthDate = new Date(startDate)
    monthDate.setDate(1)
    monthDate.setMonth(monthDate.getMonth() + monthsToAdd)
    return convertDateToUTC(monthDate).getTime() / 1000
  })
}

export function getNextSixWeeks(startDate: Date) {
  return [0, 7, 14, 21, 28, 35].map((weeksToAdd) => {
    const weekDate = new Date(startDate)
    weekDate.setDate(weekDate.getDate() + weeksToAdd)
    return convertDateToUTC(weekDate).getTime() / 1000
  })
}

export function getNextSevenDays(startDate: Date) {
  return [0, 1, 2, 3, 4, 5, 6].map((daysToAdd) => {
    const dayDate = new Date(startDate)
    dayDate.setDate(dayDate.getDate() + daysToAdd)
    return convertDateToUTC(dayDate).getTime() / 1000
  })
}

export async function getExistingTodoLists(databases: Databases, level: TodoLevel, dates: number[]): Promise<Models.DocumentList<TodoListDoc>> {
   return await databases.listDocuments(
    DATABASE_ID,
    TODOLIST_COL_ID,
    [
      Query.equal('level', level),
      Query.equal('startDate', dates)
    ]
  )
}

export function getListMapAndListsToCreate(listSearchResults: Models.DocumentList<TodoListDoc>, nextListDates: number[]): GetListMapAndListsToCreateResult {
  const listMap = new Map<number, TodoListDoc>(listSearchResults.documents.map((doc: TodoListDoc) => [doc.startDate, doc]))
  const existingListDates = [...listMap.keys()]
  const listsToCreate = nextListDates.reduce((listDates: number[], listDate: number) => {
    if (!existingListDates.includes(listDate)) {
      return [...listDates, listDate]
    }
    return listDates
  }, [])
  return {
    listMap,
    listsToCreate
  }
}

export async function createMonthLists(databases: Databases, { listMap, listsToCreate}: GetListMapAndListsToCreateResult): Promise<Map<number, TodoListDoc>> {
  const createdLists = await Promise.all(listsToCreate.map(async (startDate: number) => {
    const listData: Omit<TodoList, 'id'> = {
      startDate,
      childLists: [],
      todos: [],
      level: TodoLevel.Month
    }
    return await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), listData)
  }))
  createdLists.forEach((doc: TodoListDoc) => {
    listMap.set(doc.startDate, doc)
  })
  return listMap
}

export async function createWeekLists(databases: Databases, { listMap, listsToCreate}: GetListMapAndListsToCreateResult): Promise<Map<number, TodoListDoc>> {
  const createdLists = await Promise.all(listsToCreate.map(async (startDate: number) => {
    const monthForWeekDate = new Date(startDate * 1000)
    monthForWeekDate.setDate(1)
    const monthSearch = await databases.listDocuments(
      DATABASE_ID,
      TODOLIST_COL_ID,
      [
        Query.equal('level', TodoLevel.Month),
        Query.equal('startDate', convertDateToUTC(monthForWeekDate).getTime() / 1000)
      ]
    )
    if (monthSearch.total === 0) throw new Error(FIND_LIST_ERROR)
    const month = monthSearch.documents[0] as TodoListDoc
    const weekData: Omit<TodoList, 'id'> = {
      startDate,
      childLists: [],
      todos: [],
      level: TodoLevel.Week,
      parentList: month.$id
    }
    const createdWeek = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), weekData)
    await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, month.$id, { childLists: [...month.childLists, createdWeek.$id]})
    return createdWeek
  }))
  createdLists.forEach((doc: TodoListDoc) => {
    listMap.set(doc.startDate, doc)
  })
  return listMap
}

export async function createDayLists(databases: Databases, { listMap, listsToCreate}: GetListMapAndListsToCreateResult, firstWeekId: string): Promise<Map<number, TodoListDoc>> {
  const createdLists = await Promise.all(listsToCreate.map(async (startDate: number) => {
    const newDayData: Omit<TodoList, 'id'> = {
      startDate: startDate,
      todos: [],
      childLists: [],
      parentList: firstWeekId,
      level: TodoLevel.Day
    }
    return await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), newDayData)
  }))
  createdLists.forEach((doc: TodoListDoc) => {
    listMap.set(doc.startDate, doc)
  })
  await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, firstWeekId, { childLists: [ ...listMap.values() ].map((doc: TodoListDoc) => doc.$id)})
  return listMap
}

export function getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}: TodoBoardProgressionArgs, updatedLists: TodoListDoc[], key: string): TodoBoardProgressionArgs {
  return {
      databases,
      boardDoc: {
        ...boardDoc,
        [key]: updatedLists.sort((a, b) => a.startDate - b.startDate).map((doc: TodoListDoc) => doc.$id)
      },
      newStartDate
    }
}

export async function processMonths({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const nextListDates = getNextSixMonths(newStartDate)
  const existingListSearch = await getExistingTodoLists(databases, TodoLevel.Month, nextListDates)
  if (existingListSearch.total === 6) {
    return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, existingListSearch.documents, 'months')
  }
  const listMap = await createMonthLists(databases, getListMapAndListsToCreate(existingListSearch, nextListDates))
  return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, [...listMap.values()], 'months')
}

export async function processWeeks({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const nextListDates = getNextSixWeeks(newStartDate)
  const existingListSearch = await getExistingTodoLists(databases, TodoLevel.Week, nextListDates)
  if (existingListSearch.total === 6) {
    return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, existingListSearch.documents, 'weeks')
  }
  const listMap = await createWeekLists(databases, getListMapAndListsToCreate(existingListSearch, nextListDates))
  return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, [...listMap.values()], 'weeks')
}

export async function processDays({ databases, boardDoc, newStartDate }: TodoBoardProgressionArgs): Promise<TodoBoardProgressionArgs> {
  const nextListDates = getNextSevenDays(newStartDate)
  const existingListSearch = await getExistingTodoLists(databases, TodoLevel.Day, nextListDates)
  if (existingListSearch.total === 7) {
    return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, existingListSearch.documents, 'days')
  }
  const listMap = await createDayLists(databases, getListMapAndListsToCreate(existingListSearch, nextListDates), boardDoc.weeks[0])
  return getUpdatedTodoBoardProgressionArgs({ databases, boardDoc, newStartDate}, [...listMap.values()], 'days')
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
    processDays
  )({ databases, boardDoc: currentBoardDoc, newStartDate: convertDateToUTC(newStartDate) })
  const newBoardData: Omit<TodoBoard, 'id'> = {
    name: boardDoc.name,
    days: boardDoc.days,
    weeks: boardDoc.weeks,
    months: boardDoc.months,
    startDate: convertDateToUTC(newStartDate).getTime() / 1000
  }
  const updatedBoard = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, newBoardData)
  return getTodoBoard(databases, updatedBoard.$id)
}
