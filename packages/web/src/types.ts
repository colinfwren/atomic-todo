import {Todo, TodoBoard, TodoLevel, TodoPositionInput} from '@atomic-todo/server/src/generated/graphql'
import React, {MouseEventHandler} from "react";
import {DraggableSyntheticListeners} from "@dnd-kit/core";
import type {Transform} from '@dnd-kit/utilities';

export type SortableTodoItemProps = {
  id: string
  granularity: TodoLevel
  listStartDate: Date,
  listEndDate: Date,
  index: number,
  listId: string
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

export type TodoItemListProps = TodoItemList & {
  listPeriodDelta: number
}

export enum TodoListEra {
  past  = 'past',
  current = 'current',
  future = 'future'
}

export type TodoItemList = {
  id: string,
  granularity: TodoLevel,
  listStartDate: Date,
  listEndDate: Date,
  todos: string[]
  era: TodoListEra
}

export type TodoListMap = Map<string, TodoItemList>
export type TodoMap = Map<string, Todo>
export type AppTodoBoard = Omit<TodoBoard, 'startDate'> & {
  startDate: Date
  months: string[]
  weeks: string[]
  days: string[]
}

export type TodoBoardState = {
  board: AppTodoBoard
  todos: TodoMap,
  lists: TodoListMap
}

export type ITodoBoardContext = TodoBoardState & {
  actions: {
    setAppState: (newState: TodoBoardState) => void,
    setTodoCompleted: (todo: Todo, completed: boolean) => void,
    setTodoName: (todo: Todo, value: string) => void,
    updateTodos: (todos: Todo[]) => void,
    moveBoardForward: () => void,
    moveBoardBackward: () => void,
    setBoardName: (name: string) => void,
    showModal: (todoId: string) => void,
    hideModal: () => void,
    addTodo: (listStartDate: Date, listEndDate: Date, positions: TodoPositionInput[]) => void,
    deleteTodo: (todoId: string) => void,
  },
  loading: boolean,
  modal: ModalProps
}

export type TodoBoardProviderProps = {
  children: JSX.Element | JSX.Element[]
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
  era: TodoListEra
  listPeriodDelta: number
}

export interface ModalProps {
  visible: boolean,
  todoId: string|null
}

export interface AuthState {
  user: any
}

export type IAuthContext = AuthState & {
  actions: {
    signIn: (user: string) => void
    signOut: () => void
  }
}

export type AuthProviderProps = {
  children: JSX.Element | JSX.Element[]
}