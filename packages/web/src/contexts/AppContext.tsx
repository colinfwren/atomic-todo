import React from 'react'
import {createContext, useReducer} from 'react'
import { IAppContext, AppState, AppProviderProps } from "../types";
import {todoBoard, todoListMap, todoMap} from "../testData";
import {TodoList} from "@atomic-todo/server/dist/src/generated/graphql";

const initialState: AppState = {
  board: todoBoard,
  lists: todoListMap,
  todos: todoMap
}

const AppContext = createContext<IAppContext>({ ...initialState, actions: { setLists: () => {}}})
const { Provider } = AppContext

/**
 * AppState reducer
 *
 * @param {AppState} state - The App's current state
 * @param {Action} action - The action to apply to the state
 * @returns {AppState} The updated app state
 */
function reducer (state: AppState, action: any) {
  switch(action.type) {
    case 'SET_LISTS':
      return {
        ...state,
        lists: action.payload
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
        dispatch({ type: 'SET_LISTS', payload: lists})
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export const AppConsumer = AppContext.Consumer
export default AppContext