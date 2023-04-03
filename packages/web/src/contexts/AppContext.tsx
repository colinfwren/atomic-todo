import React, {createContext, useReducer} from 'react'
import {Action, AppProviderProps, AppState, IAppContext, StateAction} from "../types";
import {todoBoard, todoListMap, todoMap} from "../testData";
import {TodoList} from "@atomic-todo/server/dist/src/generated/graphql";

const initialState: AppState = {
  board: todoBoard,
  lists: todoListMap,
  todos: todoMap
}

const AppContext = createContext<IAppContext>({ ...initialState, actions: { setLists: () => {}, setTodoCompleted: () => {}, setTodoName: () => {}}})
const { Provider } = AppContext

/**
 * AppState reducer
 *
 * @param {AppState} state - The App's current state
 * @param {StateAction} action - The action to apply to the state
 * @returns {AppState} The updated app state
 */
function reducer (state: AppState, { type, payload}: StateAction) {
  switch(type) {
    case Action.SET_LISTS:
      return {
        ...state,
        lists: payload
      }
    case Action.SET_TODO_COMPLETED:
      return {
        ...state,
        todos: new Map(state.todos).set(payload.todoId, { ...state.todos.get(payload.todoId)!, completed: payload.completed })
      }
    case Action.SET_TODO_TEXT:
      return {
        ...state,
        todos: new Map(state.todos).set(payload.todoId, { ...state.todos.get(payload.todoId)!, name: payload.value })
      }
    default:
      return state
  }
}

/**
 * Provider for the AppContext
 *
 * @param {AppProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 * @constructor
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = {
    ...state,
    actions: {
      setLists: (lists:Map<string, TodoList>) => {
        dispatch({ type: Action.SET_LISTS, payload: lists})
      },
      setTodoCompleted: (todoId: string, completed: boolean) => {
        dispatch({ type: Action.SET_TODO_COMPLETED, payload: { todoId, completed }})
      },
      setTodoName: (todoId: string, value: string) => {
        dispatch({ type: Action.SET_TODO_TEXT, payload: { todoId, value }})
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export const AppConsumer = AppContext.Consumer
export default AppContext