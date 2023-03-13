import {Todo, TodoBoard, TodoLevel, TodoList} from '@atomic-todo/server/src/generated/graphql'

export enum UpdateOperation {
  ADD,
  REMOVE
}

export enum TraversalDirection {
  PARENTS,
  CHILDREN
}

export type TodoItemProps = Todo & {
  level: TodoLevel
  listId: string
}

export type TodoItemBoardProps = TodoBoard & {
  todos: Map<string, Todo>,
  lists: Map<string, TodoList>
}

export type TodoItemListProps = TodoList & {
  todosMap: Map<string, Todo>
}