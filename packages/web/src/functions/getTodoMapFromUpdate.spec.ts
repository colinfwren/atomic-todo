import {todo1, todo2, todo3, todoMap} from "../testData";
import {Todo} from "@atomic-todo/server/dist/src/generated/graphql";
import {getTodoMapFromUpdate, getTodoMapFromUpdates} from "./getTodoMapFromUpdate";

describe('getTodoMapFromUpdate', () => {
  it('updates the Todo in the TodoMap when the updated Todo is in the TodoMap', () => {
    const updatedTodo = {
      ...todo2,
      name: 'Updated Todo'
    }
    const result = getTodoMapFromUpdate(todoMap, updatedTodo)
    const expectedResult = new Map<string, Todo>([
      [todo1.id, todo1],
      [todo2.id, updatedTodo]
    ])
    expect(result).toEqual(expectedResult)
  })
  it('returns the original map when the updated Todo is not in the TodoMap', () => {
    const result = getTodoMapFromUpdate(todoMap, todo3)
    expect(result).toEqual(todoMap)
  })
})

describe('getTodoMapFromUpdates', () => {
  it('updates the TodoMap with the updated Todos', () => {
    const updatedTodos: Todo[] = [
      {
        ...todo1,
        name: 'Updated Todo 1'
      },
      {
        ...todo2,
        name: 'Updated Todo 2'
      }
    ]
    const result = getTodoMapFromUpdates(todoMap, updatedTodos)
    const expectedResult = new Map<string, Todo>([
      [todo1.id, updatedTodos[0]],
      [todo2.id, updatedTodos[1]]
    ])
    expect(result).toEqual(expectedResult)
  })
  it('adds new Todos to the TodoMap if the update contains Todos not originally in the TodoMap', () => {
    const updatedTodos: Todo[] = [
      {
        ...todo1,
        name: 'Updated Todo 1'
      },
      todo3
    ]
    const result = getTodoMapFromUpdates(todoMap, updatedTodos)
    const expectedResult = new Map<string, Todo>([
      [todo1.id, updatedTodos[0]],
      [todo2.id, todo2],
      [todo3.id, todo3]
    ])
    expect(result).toEqual(expectedResult)
  })
})