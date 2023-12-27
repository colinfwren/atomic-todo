import {TodoMap} from "../types";
import {Todo} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Create TodoMap from list of Todos
 *
 * @param {Todo[]} todos - List of Todos from GraphQL response
 * @returns {TodoMap} map of Todo ID to Todo
 */
export function getTodoMapFromTodos(todos: Todo[]): TodoMap {
  return new Map<string, Todo>(todos.map((todo) => [todo.id, todo]))
}