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
  board: TodoBoard
  lists: Map<string, TodoList>
  todos: Map<string, Todo>
}

export type IAppContext = AppState & {
  actions: {
    setLists: (lists: Map<string, TodoList>) => void,
    setTodoCompleted: (todo: Todo, completed: boolean) => void,
    setTodoName: (todo: Todo, value: string) => void,
    progressBoard: () => void
  },
  loading: boolean
}

export type AppProviderProps = {
  children: JSX.Element | JSX.Element[]
}