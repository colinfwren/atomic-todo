// @ts-ignore
import {TodoList} from '@atomic-todo/server/src/generated/graphql'
import {TodoListMapUpdateData, TraversalDirection, UpdateOperation} from "../types";

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
    return new Map(listMap).set(list.id, {
      ...list,
      todos: [...new Set([...list.todos, todoId])]
    })
  } else {
    return new Map(listMap).set(list.id, {
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
  const currentList = listMap.get(listId)
  if (currentList) {
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
  return listMap
}

/**
 * Return the list of update operations to carry out against the TodoList Map based on the source and target lists
 *
 * @param {string} sourceListId - ID of the source TodoList
 * @param {string} targetListId - ID of the target TodoList
 * @param {Map<string, TodoList>} listMap - Map of TodoLists
 * @returns {TodoListMapUpdateData[]} List of update operations to apply to TodoList Map
 */
function getMapUpdateData(sourceListId: string, targetListId: string, listMap: Map<string, TodoList>): TodoListMapUpdateData[] {
  const sourceList = listMap.get(sourceListId)!
  const targetList = listMap.get(targetListId)!
  const sameLevel = sourceList.level === targetList.level
  if (sourceList.level === 'day') {
    if (sameLevel) {
      return [
        {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
        {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
      ]
    } else if (targetList.level === 'week') {
      if (targetList.id === sourceList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
        ]
      }
      const sourceWeekList = listMap.get(sourceList.parentList!)!
      if (sourceWeekList.parentList === targetList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: sourceWeekList.id, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
        ]
      }
    } else {
      const sourceWeekList = listMap.get(sourceList.parentList!)!
      if (targetList.id === sourceWeekList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: sourceWeekList.id, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
        ]
      }
    }
  } else if (sourceList.level === 'week') {
    if (targetList.level === 'day') {
      if (sourceList.id === targetList.parentList) {
        return [
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
        ]
      }
      const targetWeekList = listMap.get(targetList.parentList!)!
      if (sourceList.parentList === targetWeekList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetWeekList.id, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
        ]
      }
    } else if (targetList.level === 'week') {
      if (sourceList.parentList === targetList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
        ]
      }
    } else {
      if (sourceList.parentList === targetList.id) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE}
        ]
      }
    }
  } else {
    if (targetList.level === 'day') {
      const targetWeekList = listMap.get(targetList.parentList!)!
      if (targetWeekList.parentList === sourceList.id) {
        return [
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE},
          {listId: targetWeekList.id, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE},
        ]
      }
    } else if (targetList.level === 'week') {
      if (targetList.parentList === sourceListId) {
        return [
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE}
        ]
      }
    }
  }
  return [
    {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.PARENTS},
    {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.CHILDREN},
    {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.PARENTS}
  ]
}

/**
 * Move a Todo between two TodoLists in a TodoBoard
 *
 * @param {string} sourceListId - ID of the TodoList to move the Todo from
 * @param {string} targetListId - ID of the TodoList to move the Todo to
 * @param {string} todoId - ID of the Todo to move between TodoLists
 * @param {Map<string, TodoList>} lists - Map of TodoLists to be updated
 * @returns {Map<string, TodoList>} Updated Map of TodoLists
 */
export function updateTodoListMap(sourceListId: string, targetListId: string, todoId: string, lists: Map<string, TodoList>): Map<string, TodoList> {
  return getMapUpdateData(sourceListId, targetListId, lists)
    .reduce((listMap: Map<string, TodoList>, {listId, operation, direction}) => {
        return updateLists(listId, todoId, listMap, operation, direction)
      }, lists)
}