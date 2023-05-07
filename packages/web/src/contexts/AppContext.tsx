import React, {createContext, useState} from 'react'
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
  moveBoardForward: () => {},
  moveBoardBackward: () => {},
  setBoardName: () => {},
  addTodoToList: () => {}
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

const MOVE_BOARD_FORWARD_BY_WEEK = gql`
mutation moveBoardForwardByWeek($boardId: ID!) {
  moveBoardForwardByWeek(boardId: $boardId) {
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

const MOVE_BOARD_BACKWARD_BY_WEEK = gql`
mutation moveBoardBackwardByWeek($boardId: ID!) {
  moveBoardBackwardByWeek(boardId: $boardId) {
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

const ADD_TODO = gql`
mutation addTodo($boardId: ID!, $listId: ID!) {
  addTodo(boardId: $boardId, listId: $listId) {
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

/**
 * Create a map of list ID to list values from an array of lists
 *
 * @param {TodoBoard} board - TodoBoard the TodoLists are part of
 * @param {TodoList[]} lists - Array of TodoLists
 * @return {Map<string, FormattedTodoList>} Map of List ID to TodoList
 */
function getListMap(board: TodoBoard, lists: TodoList[]): Map<string, FormattedTodoList> {
  return new Map<string, FormattedTodoList>(lists.map((todoList: TodoList) => {
    return [
      todoList.id,
      {
        ...todoList,
        startDate: (todoList.startDate * 1000),
        ...getTodoListName((board.startDate * 1000), (todoList.startDate * 1000), todoList.level)
      }
    ]
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

  useQuery(GET_DATA, {
    variables: { boardId: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2' },
    onCompleted: (data) => {
      const { board, lists, todos } = data.getTodoBoard
      setData({
        board: {
          ...board,
          startDate: (board.startDate * 1000)
        },
        lists: getListMap(board, lists),
        todos: getTodoMap(todos)
      })
      setLoading(false)
    },
    onError: (error) => {
      setError(error.message)
      setLoading(false)
    }
  })

  const [updateTodoLists] = useMutation(UPDATE_TODO_LISTS)
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [moveBoardForwardByWeek] = useMutation(MOVE_BOARD_FORWARD_BY_WEEK)
  const [moveBoardBackwardByWeek] = useMutation(MOVE_BOARD_BACKWARD_BY_WEEK)
  const [updateBoardName] = useMutation(UPDATE_BOARD_NAME)
  const [addTodo] = useMutation(ADD_TODO)

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
          setLoading(true)
          updateTodoLists({
            variables: {todoLists: update},
            optimisticResponse: {
              updateTodoLists: response
            },
            onError: (error) => {
              setError(error.message)
              setLoading(false)
            },
            onCompleted: () => {
              setLoading(false)
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
        setLoading(true)
        updateTodo({
          variables: { todo: update },
          optimisticResponse: {
            updateTodo: update
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: () => {
            setLoading(false)
          }
        })
      },
      setTodoName: (todo: Todo, value: string) => {
        const update = {
          id: todo.id,
          completed: todo.completed,
          name: value
        }
        setLoading(true)
        updateTodo({
          variables: { todo: update },
          optimisticResponse: {
            updateTodo: update
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: () => {
            setLoading(false)
          }
        })
      },
      moveBoardForward: () => {
        setLoading(true)
        moveBoardForwardByWeek({
          variables: { boardId: state.board.id },
          fetchPolicy: 'no-cache',
          onCompleted: (data) => {
            const { board, lists, todos } = data.moveBoardForwardByWeek
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              lists: getListMap(board, lists),
              todos: getTodoMap(todos)
            })
            setLoading(false)
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          }
        })
      },
      moveBoardBackward: () => {
        setLoading(true)
        moveBoardBackwardByWeek({
          variables: { boardId: state.board.id },
          fetchPolicy: 'no-cache',
          onCompleted: (data) => {
            const { board, lists, todos } = data.moveBoardBackwardByWeek
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              lists: getListMap(board, lists),
              todos: getTodoMap(todos)
            })
            setLoading(false)
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          }
        })
      },
      setBoardName: (newName: string) => {
        const update: BoardNameUpdateInput = {
          id: state.board.id,
          name: newName
        }
        setLoading(true)
        updateBoardName({
          variables: { boardNameUpdate: update },
          optimisticResponse: {
            updateBoardName: {
              name: newName
            }
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: () => {
            setLoading(false)
          }
        })
      },
      addTodoToList: (listId: string) => {
        setLoading(true)
        addTodo({
          variables: {
            boardId: state.board.id,
            listId
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: (data) => {
            const { board, lists, todos } = data.addTodo
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              lists: getListMap(board, lists),
              todos: getTodoMap(todos)
            })
            setLoading(false)
          }
        })
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export const AppConsumer = AppContext.Consumer
export default AppContext