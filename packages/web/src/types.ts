import {Todo, TodoBoard, TodoLevel, TodoPositionInput} from '@atomic-todo/server/src/generated/graphql'
import React, {HTMLInputTypeAttribute, MouseEventHandler, SyntheticEvent} from "react";
import {DraggableSyntheticListeners} from "@dnd-kit/core";
import type {Transform} from '@dnd-kit/utilities';
import { Models } from 'appwrite'

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

export type TodoListRow = {
  granularity: TodoLevel,
  deltas: number[]
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
  boardId: string,
  children: JSX.Element | JSX.Element[]
}

export type DashboardState = {
  boards: TodoBoard[]
}

export type IDashboardContext = DashboardState & {
  loading: boolean
}

export type DashboardProviderProps = {
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
  user: Models.User<Models.Preferences> | null,
  session: Models.Session | null
}

export type IAuthContext = AuthState & {
  actions: {
    signIn: (emailAddress: string, password: string) => Promise<void>
    signUp: (emailAddress: string, password: string, name: string) => Promise<void>
    signOut: () => Promise<void>
  }
}

export type AuthProviderProps = {
  children: JSX.Element | JSX.Element[]
}

export type FormInputProps = {
  fieldId: string
  label: string
  inputType: HTMLInputTypeAttribute
  isInvalid: boolean
  invalidMessage: string
}

export interface LoginFormElements extends HTMLFormControlsCollection {
  emailAddressInput: HTMLInputElement,
  passwordInput: HTMLInputElement
}

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginFormElements
}

export interface SignUpFormElements extends HTMLFormControlsCollection {
  emailAddressInput: HTMLInputElement,
  passwordInput: HTMLInputElement
  nameInput: HTMLInputElement
}

export interface SignUpFormElement extends HTMLFormElement {
  readonly elements: SignUpFormElements
}