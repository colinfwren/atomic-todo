import React, {createContext, useEffect, useReducer} from 'react'
import {Action, AppProviderProps, AppState, IAppContext, StateAction} from "../types";
import {todoBoard, emptyTodoMap, emptyTodoListMap} from "../testData";
// @ts-ignore
import {TodoList, Todo} from "@atomic-todo/server/dist/src/generated/graphql";
import {useQuery, gql} from "@apollo/client";

const initialState: AppState = {
  loading: true,
  error: null,
  board: todoBoard,
  lists: emptyTodoListMap,
  todos: emptyTodoMap
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
    case Action.SET_STATE:
      return {
        loading: false,
        error: null,
        board: payload.board,
        lists: payload.lists,
        todos: payload.todos
      }
    case Action.SET_ERROR:
      return {
        loading: false,
        error: payload.error,
        board: todoBoard,
        lists: emptyTodoListMap,
        todos: emptyTodoMap
      }
    default:
      return state
  }
}

const GET_DATA = gql`
query getData {
  todos {
    completed
    id
    name
  }
  todoBoards {
    days
    id
    months
    name
    weeks
  }
  todoLists {
    childLists
    id
    level
    name
    parentList
    todos
  }
}
`;

/**
 * Provider for the AppContext
 *
 * @param {AppProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 * @constructor
 */
export function AppProvider({ children }: AppProviderProps) {
  const { loading, error, data } = useQuery(GET_DATA);

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!loading && data) {
      const board = data.todoBoards[0]
      const listMap = new Map<string, TodoList>(data.todoLists.map((todoList: TodoList) => {
        return [todoList.id, todoList]
      }))
      const todoMap = new Map<string, Todo>(data.todos.map((todo: Todo) => {
        return [todo.id, todo]
      }))
      dispatch({ type: Action.SET_STATE, payload: { board, lists: listMap, todos: todoMap }})
    }
    if (!loading && error) {
      dispatch({ type: Action.SET_ERROR, payload: { error }})
    }
  }, [loading, data, error])

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