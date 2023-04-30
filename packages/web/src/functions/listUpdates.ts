// @ts-ignore
import {TodoList} from '@atomic-todo/server/src/generated/graphql'
import {FormattedTodoList, TodoListMapUpdateData, TraversalDirection, UpdateOperation} from "../types";

export const CHILDREN_TRAVERSAL_ADD_ERROR = `Don't call ADD UpdateOperation with CHILDREN TraversalDirection`

/**
 * Get an order list of the todos with the new todo at the index that is passed in
 *
 * @param {string[]} todos - The list of Todos
 * @param {string} todoId - The ID of the Todo to add
 * @param {number} index - The index to add the Todo at
 * @returns {string[]} - The updated list Todos
 */
export function getOrderedTodos(todos: string[], todoId: string, index = -1): string[] {
  if (todos.includes(todoId) && index < 0)  return todos
  if (index < 0) {
    return [...todos, todoId]
  }
  const cleanedTodos = todos.filter((x: string) => x != todoId)
  return [
    ...cleanedTodos.slice(0, index),
    todoId,
    ...cleanedTodos.slice(index, cleanedTodos.length)
  ]
}

/**
 * Apply an update to the passed in map of TodoLists and return the updated list
 *
 * @param {FormattedTodoList} list - The TodoList to update
 * @param {string} todoId - The ID of the Todo to add/remove
 * @param {Map<string, FormattedTodoList>} listMap - The Map of TodoLists to update
 * @param {UpdateOperation} operation - The operation to perform
 * @param {number} newIndex - The index to add items into the list at
 * @returns {Map<string, FormattedTodoList>} Updated Map of TodoLists
 */
export function updateList(list: FormattedTodoList, todoId: string, listMap: Map<string, FormattedTodoList>, operation: UpdateOperation, newIndex = -1): Map<string, FormattedTodoList> {
  if ([UpdateOperation.ADD, UpdateOperation.REORDER].includes(operation)) {
    const newTodos = getOrderedTodos(list.todos, todoId, newIndex)
    return new Map(listMap).set(list.id, {
      ...list,
      todos: [...new Set(newTodos)]
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
 * @param {Map<string, FormattedTodoList>} listMap - The map TodoLists to amend
 * @param {UpdateOperation} operation - The operation to perform
 * @param {TraversalDirection} direction - The direction to traverse the graph
 * @param {number} newIndex - The index to put the moved Todo in the list when performing a add operation
 * @returns {Map<string, FormattedTodoList>} Updated Map of TodoLists
 */
export function updateLists(listId: string, todoId: string, listMap: Map<string, FormattedTodoList>,  operation: UpdateOperation, direction: TraversalDirection, newIndex = -1): Map<string, FormattedTodoList> {
  if (operation === UpdateOperation.ADD && direction === TraversalDirection.CHILDREN) throw new Error(CHILDREN_TRAVERSAL_ADD_ERROR)
  const currentList = listMap.get(listId)
  if (currentList) {
    const lists = updateList(currentList, todoId, new Map(listMap), operation, newIndex)
    if (direction === TraversalDirection.PARENTS && currentList.parentList !== null) {
      return updateLists(currentList.parentList!, todoId, lists, operation, direction)
    }
    if (direction === TraversalDirection.CHILDREN) {
      return currentList.childLists.reduce((lists: Map<string, FormattedTodoList>, childListId: string) => {
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
 * @param {number} newIndex - Index to set the moved Todo at when adding to a list
 * @returns {TodoListMapUpdateData[]} List of update operations to apply to TodoList Map
 */
function getMapUpdateData(sourceListId: string, targetListId: string, listMap: Map<string, TodoList>, newIndex = -1): TodoListMapUpdateData[] {
  const sourceList = listMap.get(sourceListId)!
  const targetList = listMap.get(targetListId)!
  const sameLevel = sourceList.level === targetList.level
  if (targetListId === sourceListId) {
    return [
      {listId: targetListId, operation: UpdateOperation.REORDER, direction: TraversalDirection.NONE, newIndex}
    ]
  }
  if (sourceList.level === 'day') {
    if (sameLevel) {
      return [
        {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
        {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
      ]
    } else if (targetList.level === 'week') {
      if (targetList.id === sourceList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.REORDER, direction: TraversalDirection.NONE, newIndex},
        ]
      }
      const sourceWeekList = listMap.get(sourceList.parentList!)!
      if (sourceWeekList.parentList === targetList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: sourceWeekList.id, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
        ]
      }
    } else {
      const sourceWeekList = listMap.get(sourceList.parentList!)!
      if (targetList.id === sourceWeekList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: sourceWeekList.id, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.REORDER, direction: TraversalDirection.NONE, newIndex},
        ]
      }
    }
  } else if (sourceList.level === 'week') {
    if (targetList.level === 'day') {
      if (sourceList.id === targetList.parentList) {
        return [
          ...sourceList.childLists.map((childListId: string) => {
            return {listId: childListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE}
          }),
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
        ]
      }
      const targetWeekList = listMap.get(targetList.parentList!)!
      if (sourceList.parentList === targetWeekList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetWeekList.id, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
        ]
      }
    } else if (targetList.level === 'week') {
      if (sourceList.parentList === targetList.parentList) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.CHILDREN},
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
        ]
      }
    } else {
      if (sourceList.parentList === targetList.id) {
        return [
          {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.NONE},
          {listId: targetListId, operation: UpdateOperation.REORDER, direction: TraversalDirection.NONE, newIndex}
        ]
      }
    }
  } else {
    if (targetList.level === 'day') {
      const targetWeekList = listMap.get(targetList.parentList!)!
      if (targetWeekList.parentList === sourceList.id) {
        return [
          ...sourceList.childLists.map((childListId: string) => {
            return { listId: childListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.CHILDREN}
          }),
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex},
          {listId: targetWeekList.id, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE},
        ]
      }
    } else if (targetList.level === 'week') {
      if (targetList.parentList === sourceListId) {
        return [
          ...sourceList.childLists.map((childListId: string) => {
            return { listId: childListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.CHILDREN}
          }),
          {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.NONE, newIndex}
        ]
      }
    }
  }
  return [
    {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.PARENTS},
    {listId: sourceListId, operation: UpdateOperation.REMOVE, direction: TraversalDirection.CHILDREN},
    {listId: targetListId, operation: UpdateOperation.ADD, direction: TraversalDirection.PARENTS, newIndex}
  ]
}

/**
 * Move a Todo between two TodoLists in a TodoBoard
 *
 * @param {string} sourceListId - ID of the TodoList to move the Todo from
 * @param {string} targetListId - ID of the TodoList to move the Todo to
 * @param {string} todoId - ID of the Todo to move between TodoLists
 * @param {Map<string, FormattedTodoList>} lists - Map of TodoLists to be updated
 * @param {number} newIndex - Optional index to place the moved Todo at in the list it's moving to
 * @returns {Map<string, FormattedTodoList>} Updated Map of TodoLists
 */
export function updateTodoListMap(sourceListId: string, targetListId: string, todoId: string, lists: Map<string, FormattedTodoList>, newIndex = -1): Map<string, FormattedTodoList> {
  return getMapUpdateData(sourceListId, targetListId, lists, newIndex)
    .reduce((listMap: Map<string, FormattedTodoList>, {listId, operation, direction, newIndex}) => {
        return updateLists(listId, todoId, listMap, operation, direction, newIndex)
      }, lists)
}