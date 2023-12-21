import {TodoBoard, TodoBoardResult} from "../generated/graphql";
import {Databases} from "node-appwrite";
import {
  BoardMoveDirection,
  TodoBoardDoc,
} from "../types";
import {DATABASE_ID, TODOBOARD_COL_ID} from "../consts";
import {getTodoBoard} from './getDocs'
import {convertDateToUTC} from "./utils";

export const DATE_ERROR = 'Invalid Dates provided'
export const FIND_LIST_ERROR = 'Unable to find list'
export const UPDATE_APPWRITE_DOCUMENT_ERROR = 'Unable to update list'
export const CREATE_APPWRITE_DOCUMENT_ERROR = 'Unable to create document'

export async function moveBoardByWeek(databases: Databases, boardId: string, direction: BoardMoveDirection = BoardMoveDirection.FORWARD): Promise<TodoBoardResult> {
  const currentBoardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId)
  const newStartDate = new Date(currentBoardDoc.startDate * 1000)
  if (isNaN(+newStartDate)) throw new Error(DATE_ERROR)
  if (direction === BoardMoveDirection.FORWARD) {
    newStartDate.setDate(newStartDate.getDate() + 7)
  } else {
    newStartDate.setDate(newStartDate.getDate() - 7)
  }
  const newBoardData: Omit<TodoBoard, 'id'> = {
    name: currentBoardDoc.name,
    startDate: convertDateToUTC(newStartDate).getTime() / 1000
  }
  const updatedBoard = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, newBoardData)
  return getTodoBoard(databases, updatedBoard.$id)
}
