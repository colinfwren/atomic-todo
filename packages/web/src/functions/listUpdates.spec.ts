import {updateList} from "./listUpdates";
import {TODO_ID, todoListMap, WEEK_ONE_ID, MONTH_TWO_ID} from "../testData";
import {UpdateOperation} from "../types";

describe('updating a TodoList with updateList', () => {
  it('adds a todo ID to a list\'s todo array when the array doesn\'t contain that ID', () => {
    const list = todoListMap.get(MONTH_TWO_ID)!
    const updatedMap = updateList(
      list,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD
    )
    const expectedResult = new Map(todoListMap).set(list.id, { ...list, todos: [...list.todos, TODO_ID]})
    expect(updatedMap).toEqual(expectedResult)
  })
  it('only keeps one copy of todo ID in a list that has an ID added to it but already has that ID', () => {
    const list = todoListMap.get(WEEK_ONE_ID)!
    const updatedMap = updateList(
      list,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD
    )
    expect(updatedMap).toEqual(todoListMap)
  })
  it('removes a todo ID from a list\'s todo array', () => {
    const list = todoListMap.get(WEEK_ONE_ID)!
    const updatedMap = updateList(
      list,
      TODO_ID,
      todoListMap,
      UpdateOperation.REMOVE
    )
    const expectedResult = new Map(todoListMap).set(list.id, { ...list, todos: list.todos.filter(x => x !== TODO_ID)})
    expect(updatedMap).toEqual(expectedResult)
  })
})