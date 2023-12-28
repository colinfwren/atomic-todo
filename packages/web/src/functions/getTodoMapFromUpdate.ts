import {TodoMap} from "../types";
import {Todo} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Create a new TodoMap with the updated Todo in place of the old one
 *
 * @param {TodoMap} todoMap - The existing map of Todos
 * @param {Todo} updatedTodo - The updated Todo returned by the server
 * @returns {TodoMap} The new map of Todos with the update applied
 */
export function getTodoMapFromUpdate(todoMap: TodoMap, updatedTodo: Todo): TodoMap {
  return new Map<string, Todo>([...todoMap.entries()].map(([key, todo]) => {
    if (todo.id === updatedTodo.id) {
      return [key, updatedTodo]
    }
    return [key, todo]
  }))
}

/**
 * Create a new TodoMap with the updated Todos in place of the old one
 *
 * @param {TodoMap} todoMap - The existing map of Todos
 * @param {Todo[]} updatedTodos - The updated Todos returned by the server
 * @returns {TodoMap} The new map of Todos with the update applied
 */
export function getTodoMapFromUpdates(todoMap: TodoMap, updatedTodos: Todo[]): TodoMap {
  const updatedTodoMap = new Map<string, Todo>(updatedTodos.map((todo) => [todo.id, todo]))
  return new Map<string, Todo>([...todoMap.entries(), ...updatedTodoMap.entries()])
}