import {TodoList} from '@atomic-todo/server/src/generated/graphql'
import {TraversalDirection, UpdateOperation} from "../types";

/**
 * Apply an update to the passed in map of TodoLists and return the updated list
 *
 * @param {TodoList} list - The TodoList to update
 * @param {string} todoId - The ID of the Todo to add/remove
 * @param {Map<string, TodoList>} listMap - The Map of TodoLists to update
 * @param {UpdateOperation} operation - The operation to perform
 * @returns {Map<string, TodoList>} Updated Map of TodoLists
 */
export function updateList(list: TodoList, todoId: string, listMap: Map<string, TodoList>, operation: UpdateOperation): Map<string, TodoList> {
  if (operation === UpdateOperation.ADD) {
    return listMap.set(list.id, {
      ...list,
      todos: [...new Set([...list.todos, todoId])]
    })
  } else {
    return listMap.set(list.id, {
      ...list,
      todos: list.todos.filter((x: string) => x !== todoId)
    })
  }
}

/**
 * Traverse up the graph of parent or children lists and add or remove todos from those lists
 *
 * @param {string} listId - ID of the TodoList to amend
 * @param {string} todoId - ID of the Todo to amend
 * @param {Map<string, TodoList>} listMap - The map TodoLists to amend
 * @param {UpdateOperation} operation - The operation to perform
 * @param {TraversalDirection} direction - The direction to traverse the graph
 * @returns {Map<string, TodoList>} Updated Map of TodoLists
 */
export function updateLists(listId: string, todoId: string, listMap: Map<string, TodoList>,  operation: UpdateOperation, direction: TraversalDirection): Map<string, TodoList> {
  const currentList = listMap.get(listId)!
  const lists = updateList(currentList, todoId, new Map(listMap), operation)
  if (direction === TraversalDirection.PARENTS && currentList.parentList !== null) {
    return updateLists(currentList.parentList!, todoId, lists, operation, direction)
  }
  if (direction === TraversalDirection.CHILDREN) {
    return currentList.childLists.reduce((lists: Map<string, TodoList>, childListId: string) => {
      return updateLists(childListId, todoId, lists, operation, direction)
    }, lists)
  }
  return lists
}
