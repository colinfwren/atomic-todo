import React, {createContext, useEffect, useState} from 'react'
import {AppProviderProps, AppState, FormattedTodoList, IAppContext} from "../types";
import {todoBoard, emptyTodoMap, emptyTodoListMap} from "../testData";
// @ts-ignore
import {
  TodoList,
  Todo,
  TodoLevel,
  TodoBoard,
  BoardNameUpdateInput
} from "@atomic-todo/server/dist/src/generated/graphql";
import {useQuery, gql, useMutation} from "@apollo/client";
import { getTodoListName } from "../functions/getTodoListName";

const initialState: AppState = {
  board: todoBoard,
  lists: emptyTodoListMap,
  todos: emptyTodoMap
}

const actions = {
  setLists: () => {},
  setTodoCompleted: () => {},
  setTodoName: () => {},
  progressBoard: () => {},
  setBoardName: () => {}
}

const AppContext = createContext<IAppContext>({ ...initialState, actions, loading: false})
const { Provider } = AppContext

const GET_DATA = gql`
query getData($boardId: ID!) {
  getTodoBoard(id: $boardId) {
    board {
      id
      name
      days
      weeks
      months
      startDate
    }
    lists {
      id
      name
      level
      todos
      parentList
      childLists
      startDate
    }
    todos {
      id
      name
      completed
    }
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

const PROGRESS_BOARD_BY_WEEK = gql`
mutation ProgressBoardByWeek($boardId: ID!) {
  progressBoardByWeek(boardId: $boardId) {
    board {
      id
      name
      days
      weeks
      months
      startDate
    }
    lists {
      id
      name
      level
      todos
      parentList
      childLists
      startDate
    }
    todos {
      id
      name
      completed
    }
  }
}
`;

const UPDATE_BOARD_NAME = gql`
mutation UpdateBoardName($boardNameUpdate: BoardNameUpdateInput!) {
  updateBoardName(boardNameUpdate: $boardNameUpdate) {
    name
  }
}
`

/**
 * Create a map of list ID to list values from an array of lists
 *
 * @param {TodoBoard} board - TodoBoard the TodoLists are part of
 * @param {TodoList[]} lists - Array of TodoLists
 * @return {Map<string, FormattedTodoList>} Map of List ID to TodoList
 */
function getListMap(board: TodoBoard, lists: TodoList[]): Map<string, FormattedTodoList> {
  return new Map<string, FormattedTodoList>(lists.map((todoList: TodoList) => {
    return [todoList.id, { ...todoList, ...getTodoListName(board.startDate, todoList.startDate, todoList.level) }]
  }))
}

/**
 * Create a map of Todo ID to Todo value from array of Todos
 *
 * @param {Todo[]} todos - Array of Todos
 * @return {Map<string, Todo>} Map of Todo ID to Todo
 */
function getTodoMap(todos: Todo[]): Map<string, Todo> {
  return new Map<string, Todo>(todos.map((todo: Todo) => {
    return [todo.id, todo]
  }))
}

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

  const initialDataLoad = useQuery(GET_DATA, { variables: { boardId: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2' }})
  const [updateTodoLists, updateTodoListsData] = useMutation(UPDATE_TODO_LISTS)
  const [updateTodo, updateTodoData] = useMutation(UPDATE_TODO)
  const [progressBoardByWeek, progressBoardByWeekData] = useMutation(PROGRESS_BOARD_BY_WEEK)
  const [updateBoardName, updateBoardNameData] = useMutation(UPDATE_BOARD_NAME)

  useEffect(() => {
    if (!initialDataLoad.loading && initialDataLoad.data) {
      const { board, lists, todos } = initialDataLoad.data.getTodoBoard
      setData({ board, lists: getListMap(board, lists), todos: getTodoMap(todos) })
      setLoading(false)
    }
    if (!initialDataLoad.loading && initialDataLoad.error) {
      setError(initialDataLoad.error.message)
      setLoading(false)
    }
  }, [initialDataLoad])

  useEffect(() => {
    setLoading(updateTodoListsData.loading || updateTodoData.loading || progressBoardByWeekData.loading || updateBoardNameData.loading)

    if (updateTodoListsData.error) {
      setError(updateTodoListsData.error.message)
    }

    if (updateTodoData.error) {
      setError(updateTodoData.error.message)
    }

    if (progressBoardByWeekData.error) {
      setError(progressBoardByWeekData.error.message)
    }

    if (updateBoardNameData.error) {
      setError(updateBoardNameData.error.message)
    }

    if (!progressBoardByWeekData.loading && progressBoardByWeekData.data) {
      const { board, lists, todos } = progressBoardByWeekData.data.progressBoardByWeek
      setData({ board, lists: getListMap(board, lists), todos: getTodoMap(todos) })
    }

  }, [updateTodoData, updateTodoListsData, progressBoardByWeekData, updateBoardNameData])

  const state = {
    ...data,
    loading,
    error
  }

  const value = {
    ...state,
    actions: {
      setLists: (lists:Map<string, FormattedTodoList>, sendToServer = true) => {
        setData((currentState: AppState) => ({ ...currentState, lists }))
        if (sendToServer) {
          const update = [...lists.entries()].map(([id, todoList]) => {
            return {
              id,
              todos: todoList.todos
            }
          })
          const response = [...lists.entries()].map(([_, todoList]) => todoList)
          updateTodoLists({
            variables: {todoLists: update},
            optimisticResponse: {
              updateTodoLists: response
            }
          })
        }
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
      },
      progressBoard: () => {
        progressBoardByWeek({
          variables: { boardId: state.board.id }
        })
      },
      setBoardName: (newName: string) => {
        const update: BoardNameUpdateInput = {
          id: state.board.id,
          name: newName
        }
        updateBoardName({
          variables: { boardNameUpdate: update },
          optimisticResponse: {
            updateBoardName: {
              name: newName
            }
          }
        })
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export const AppConsumer = AppContext.Consumer
export default AppContext