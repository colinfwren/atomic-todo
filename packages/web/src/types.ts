import {Todo, TodoBoard, TodoLevel, TodoList} from '@atomic-todo/server/src/generated/graphql'

export enum UpdateOperation {
  ADD,
  REMOVE
}

export enum TraversalDirection {
  PARENTS,
  CHILDREN,
  NONE
}

export enum Action {
  SET_LISTS,
  SET_TODO_COMPLETED,
  SET_TODO_TEXT,
  SET_STATE,
  SET_ERROR,
}

export type TodoListMapUpdateData = {
  listId: string,
  operation: UpdateOperation,
  direction: TraversalDirection
}

export type TodoItemProps = {
  id: string
  level: TodoLevel
  listId: string
}

export type TodoItemListProps = {
  id: string
  level: TodoLevel
}

export type AppState = {
  loading: boolean
  error: string | null
  board: TodoBoard
  lists: Map<string, TodoList>
  todos: Map<string, Todo>
}

export type IAppContext = AppState & {
  actions: {
    setLists: (lists: Map<string, TodoList>) => void,
    setTodoCompleted: (todoID: string, completed: boolean) => void,
    setTodoName: (todoId: string, value: string) => void
  }
}

export type AppProviderProps = {
  children: JSX.Element | JSX.Element[]
}

export type StateAction = {
  type: Action,
  payload: any
}