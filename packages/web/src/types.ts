import {Todo, TodoBoard, TodoLevel} from '@atomic-todo/server/src/generated/graphql'
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
  granularity: TodoLevel
  listStartDate: Date,
  listEndDate: Date,
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
  granularity: TodoLevel,
  currentDate: Date,
  listStartDate: Date,
  listPeriodDelta: number
}

export type AppState = {
  board: TodoBoard
  todos: Todo[]
}

export type IAppContext = AppState & {
  actions: {
    setTodoCompleted: (todo: Todo, completed: boolean) => void,
    setTodoName: (todo: Todo, value: string) => void,
    setTodoDateSpan: (todo: Todo, startDate: Date, endDate: Date, granularity: TodoLevel) => void,
    moveBoardForward: () => void,
    moveBoardBackward: () => void,
    setBoardName: (name: string) => void,
    showModal: (todoId: string) => void,
    hideModal: () => void,
    addTodo: (listStartDate: Date, listEndDate: Date) => void,
    deleteTodo: (todoId: string) => void,
  },
  loading: boolean,
  modal: ModalProps
}

export type AppProviderProps = {
  children: JSX.Element | JSX.Element[]
}

export type TodoListTitle = {
  name: string,
  date: string,
}

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
  granularity: TodoLevel
  listStartDate: Date
  currentDate: Date
  listPeriodDelta: number
}

export interface ModalProps {
  visible: boolean,
  todoId: string|null
}