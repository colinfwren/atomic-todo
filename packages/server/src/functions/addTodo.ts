import {TodoBoardResult, TodoLevel, TodoPositionInput} from "../generated/graphql";
import {Databases, ID} from "node-appwrite";
import {DATABASE_ID, TODO_COL_ID} from "../consts";
import {getTodoBoard} from "./getDocs";

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

export async function addTodo(databases: Databases, boardId: string, startDate: number, endDate: number, positions: TodoPositionInput[]): Promise<TodoBoardResult> {
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

  await databases.createDocument(DATABASE_ID, TODO_COL_ID, ID.unique(), todoToAdd)
  return getTodoBoard(databases, boardId)
}