import React, {createContext, useEffect, useState} from 'react'
import {AppProviderProps, AppState, IAppContext} from "../types";
import {todoBoard, emptyTodoMap, emptyTodoListMap} from "../testData";
// @ts-ignore
import {TodoList, Todo, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {useQuery, gql, useMutation} from "@apollo/client";
import { getTodoListName } from "../functions/getTodoListName";

const initialState: AppState = {
  board: todoBoard,
  lists: emptyTodoListMap,
  todos: emptyTodoMap
}

const AppContext = createContext<IAppContext>({ ...initialState, actions: { setLists: () => {}, setTodoCompleted: () => {}, setTodoName: () => {}}})
const { Provider } = AppContext

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
    startDate
  }
  todoLists {
    childLists
    id
    level
    startDate
    parentList
    todos
  }
}
`;

const UPDATE_TODO_LISTS = gql`
mutation updateTodoLists($todoLists: [TodoListUpdateInput!]!) {
  updateTodoLists(todoLists: $todoLists) {
    childLists
    id
    level
    parentList
    todos
    startDate
  }
}
`;

const UPDATE_TODO = gql`
mutation updateTodo($todo: TodoUpdateInput!) {
  updateTodo(todo: $todo) {
    id
    name
    completed
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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [data, setData] = useState<AppState>({
    board: initialState.board,
    lists: initialState.lists,
    todos: initialState.todos
  })

  const initialDataLoad = useQuery(GET_DATA)
  const [updateTodoLists, updateTodoListsData] = useMutation(UPDATE_TODO_LISTS)
  const [updateTodo, updateTodoData] = useMutation(UPDATE_TODO)

  useEffect(() => {
    if (!initialDataLoad.loading && initialDataLoad.data) {
      const board = initialDataLoad.data.todoBoards[0]
      const listMap = new Map<string, TodoList>(initialDataLoad.data.todoLists.map((todoList: TodoList) => {
        return [todoList.id, { ...todoList, name: getTodoListName(board.startDate, todoList.startDate, todoList.level) }]
      }))
      const todoMap = new Map<string, Todo>(initialDataLoad.data.todos.map((todo: Todo) => {
        return [todo.id, todo]
      }))
      setData({ board, lists: listMap, todos: todoMap })
      setLoading(false)
    }
    if (!initialDataLoad.loading && initialDataLoad.error) {
      setError(initialDataLoad.error.message)
      setLoading(false)
    }
  }, [initialDataLoad])

  useEffect(() => {
    setLoading(updateTodoListsData.loading || updateTodoData.loading)

    if (updateTodoListsData.error) {
      setError(updateTodoListsData.error.message)
    }

    if (updateTodoData.error) {
      setError(updateTodoData.error.message)
    }
  }, [updateTodoData, updateTodoListsData])

  const state = {
    ...data,
    loading,
    error
  }

  const value = {
    ...state,
    actions: {
      setLists: (lists:Map<string, TodoList>) => {
        setData((currentState: AppState) => ({ ...currentState, lists }))
        const update = [ ...lists.entries()].map(([id, todoList]) => {
          return {
            id,
            todos: todoList.todos
          }
        })
        const response = [ ...lists.entries()].map(([_, todoList]) => todoList)
        updateTodoLists({
          variables: { todoLists: update },
          optimisticResponse: {
            updateTodoLists: response
          }
        })
      },
      setTodoCompleted: (todo: Todo, completed: boolean) => {
        const update = {
          id: todo.id,
          name: todo.name,
          completed
        }
        updateTodo({
          variables: { todo: update },
          optimisticResponse: {
            updateTodo: update
          }
        })
      },
      setTodoName: (todo: Todo, value: string) => {
        const update = {
          id: todo.id,
          completed: todo.completed,
          name: value
        }
        updateTodo({
          variables: { todo: update },
          optimisticResponse: {
            updateTodo: update
          }
        })
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export const AppConsumer = AppContext.Consumer
export default AppContext