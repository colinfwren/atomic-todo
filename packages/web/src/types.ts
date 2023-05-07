import {Todo, TodoBoard, TodoLevel, TodoList} from '@atomic-todo/server/src/generated/graphql'
import React, {MouseEventHandler} from "react";
import {DraggableSyntheticListeners} from "@dnd-kit/core";
import type {Transform} from '@dnd-kit/utilities';

export enum UpdateOperation {
  ADD,
  REMOVE,
  REORDER
}

export enum TraversalDirection {
  PARENTS,
  CHILDREN,
  NONE
}

export type TodoListMapUpdateData = {
  listId: string,
  operation: UpdateOperation,
  direction: TraversalDirection,
  newIndex?: number
}

export type SortableTodoItemProps = {
  id: string
  level: TodoLevel
  listId: string
  index: number,
}

export type TodoItemProps = {
  ref?: React.Ref<HTMLDivElement>,
  handleProps?: any,
  id: string,
  index: number,
  dragging?: boolean,
  sorting?: boolean,
  transition?: string,
  transform?: Transform | null
  listeners?: DraggableSyntheticListeners
  dragOverlay?: boolean
}

export type TodoItemListProps = {
  id: string
  level: TodoLevel,
  currentDate: Date
}

export type AppState = {
  board: TodoBoard
  lists: Map<string, FormattedTodoList>
  todos: Map<string, Todo>
}

export type IAppContext = AppState & {
  actions: {
    setLists: (lists: Map<string, FormattedTodoList>, sendToServer?: boolean) => void,
    setTodoCompleted: (todo: Todo, completed: boolean) => void,
    setTodoName: (todo: Todo, value: string) => void,
    moveBoardForward: () => void,
    moveBoardBackward: () => void,
    setBoardName: (name: string) => void,
    addTodoToList: (listId: string) => void
  },
  loading: boolean
}

export type AppProviderProps = {
  children: JSX.Element | JSX.Element[]
}

export type TodoListTitle = {
  name: string,
  date: string,
}

export type FormattedTodoList = TodoList & { date: string }

export enum ProgressButtonDirection {
  FORWARD,
  BACKWARD
}

export interface ProgressionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled: boolean
  direction: ProgressButtonDirection
}

export interface TodoItemListTitleProps {
  list: FormattedTodoList,
  currentDate: Date
}