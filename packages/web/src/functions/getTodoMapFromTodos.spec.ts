import {Todo} from "@atomic-todo/server/dist/src/generated/graphql";
import {getTodoMapFromTodos} from "./getTodoMapFromTodos";
import {todo1, todo2} from "../testData";

describe('getTodoMapFromTodos', () => {
  it('converts an array of Todos into a map of Todo.id to Todo', () => {
    const todos: Todo[] = [todo1, todo2]
    const result = getTodoMapFromTodos(todos)
    const expectedResult = new Map<string, Todo>([
      [todos[0].id, todos[0]],
      [todos[1].id, todos[1]],
    ])
    expect(result).toEqual(expectedResult)
  })
})