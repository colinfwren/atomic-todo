import { TodoBoardResult } from "../generated/graphql";
import { Databases, ID, Models, Permission, Role } from "node-appwrite";
import { DATABASE_ID, TODOBOARD_COL_ID } from "../consts";
import { getTodoBoard } from "./getDocs";
import {getHoursToFirstDayOfWeek} from "./utils";
export async function addTodoBoard(databases: Databases, user: Models.User<Models.Preferences>): Promise<TodoBoardResult> {
  const boardStartDate = new Date()
  boardStartDate.setHours(0, 0, 0, 0)
  boardStartDate.setHours(getHoursToFirstDayOfWeek(boardStartDate))
  const todoBoardData = {
    name: 'New TodoBoard',
    startDate: boardStartDate.getTime() / 1000 // the start of the current week
  }
  const board = await databases.createDocument(DATABASE_ID, TODOBOARD_COL_ID, ID.unique(), todoBoardData, [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ])
  return getTodoBoard(databases, board.$id)
}