import {TodoBoardResult, TodoLevel, TodoPositionInput} from "../generated/graphql";
import {Databases, ID, Models, Permission, Role} from "node-appwrite";
import {DATABASE_ID, TODO_COL_ID, TODOBOARD_COL_ID} from "../consts";
import {getTodoBoard} from "./getTodoBoard";
import {TodoBoardDoc} from "../types";

function getPositionKey(granularity: TodoLevel) {
  switch (granularity) {
    case TodoLevel.Month:
      return 'posInMonth'
    case TodoLevel.Week:
      return 'posInWeek'
    case TodoLevel.Day:
      return 'posInDay'
  }
}

export async function addTodo(databases: Databases, user: Models.User<Models.Preferences>, boardId: string, startDate: number, endDate: number, positions: TodoPositionInput[]): Promise<TodoBoardResult> {
  const baseTodo = {
    name: 'New Todo',
    completed: false,
    startDate: startDate,
    endDate: endDate,
    showInYear: true,
    showInMonth: true,
    showInWeek: true
  }
  const todoToAdd = positions.reduce((todo, position) => {
    const positionKey = getPositionKey(position.granularity)
    return {
      ...todo,
      [positionKey]: position.position
    }
  }, baseTodo)
  const todoDoc = await databases.createDocument(DATABASE_ID, TODO_COL_ID, ID.unique(), todoToAdd, [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ])
  const boardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId)
  await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, {
    todos: [...boardDoc.todos.map((todo) => todo.$id), todoDoc.$id]
  })
  return getTodoBoard(databases, boardId)
}