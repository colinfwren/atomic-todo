import React, {createContext, useState} from 'react'
import {AppProviderProps, AppState, IAppContext, ModalProps} from "../types";
import {todoBoard} from "../testData";
// @ts-ignore
import {BoardNameUpdateInput, Todo, TodoBoard, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {gql, useMutation, useQuery} from "@apollo/client";

const initialState: AppState = {
  board: todoBoard,
  todos: []
}

const actions = {
  setLists: () => {},
  setTodoCompleted: () => {},
  setTodoName: () => {},
  setTodoDateSpan: (todo: Todo, startDate: Date, endDate: Date, granularity: TodoLevel) => {},
  moveBoardForward: () => {},
  moveBoardBackward: () => {},
  setBoardName: () => {},
  addTodo: (listStartDate: Date, listEndDate: Date) => {},
  showModal: (todoId: string) => {},
  hideModal: () => {},
  deleteTodo: (todoId: string) => {}
}

const AppContext = createContext<IAppContext>({ ...initialState, actions, loading: false, modal: { visible: false, todoId: null }})
const { Provider } = AppContext

const GET_DATA = gql`
query getData($boardId: ID!) {
  getTodoBoard(id: $boardId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
    }
  }
}
`;

const UPDATE_TODO = gql`
mutation updateTodo($todo: TodoUpdateInput!) {
  updateTodo(todo: $todo) {
    id
    name
    completed
    startDate
    endDate
    showInYear
    showInMonth
    showInWeek
  }
}
`;

const MOVE_BOARD_FORWARD_BY_WEEK = gql`
mutation moveBoardForwardByWeek($boardId: ID!) {
  moveBoardForwardByWeek(boardId: $boardId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
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
      startDate
    }
    todos {
      id
      name
      completed
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
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
mutation addTodo($boardId: ID!, $startDate: Int!, $endDate: Int!) {
  addTodo(boardId: $boardId, startDate: $startDate, endDate: $endDate) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
    }
  }
}
`;

const DELETE_TODO = gql`
mutation deleteTodo($boardId: ID!, $todoId: ID!) {
  deleteTodo(boardId: $boardId, todoId: $todoId) {
    board {
      id
      name
      startDate
    }
    todos {
      id
      name
      completed
      startDate
      endDate
      showInYear
      showInMonth
      showInWeek
    }
  }
}
`

/**
 * Get the appropriate flag to update on the Todo for the granularity of the list it moved to
 *
 * @param {TodoLevel} granularity - The list granularity
 */
function getGranularityKey(granularity: TodoLevel): string {
  switch (granularity) {
    case TodoLevel.Month:
      return 'showInMonth'
    case TodoLevel.Week:
      return 'showInWeek'
    default:
      return 'showInYear'
  }
}

/**
 * Provider for the AppContext
 *
 * @param {AppProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 */
export function AppProvider({ children }: AppProviderProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [modal, setModal] = useState<ModalProps>({ visible: false, todoId: null })
  const [data, setData] = useState<AppState>({
    board: initialState.board,
    todos: initialState.todos
  })

  useQuery(GET_DATA, {
    variables: { boardId: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2' },
    onCompleted: (data) => {
      const { board, todos } = data.getTodoBoard
      setData({
        board: {
          ...board,
          startDate: (board.startDate * 1000)
        },
        todos
      })
      setLoading(false)
    },
    onError: (error) => {
      setError(error.message)
      setLoading(false)
    }
  })

  const [updateTodo] = useMutation(UPDATE_TODO)
  const [moveBoardForwardByWeek] = useMutation(MOVE_BOARD_FORWARD_BY_WEEK)
  const [moveBoardBackwardByWeek] = useMutation(MOVE_BOARD_BACKWARD_BY_WEEK)
  const [updateBoardName] = useMutation(UPDATE_BOARD_NAME)
  const [addTodo] = useMutation(ADD_TODO)
  const [deleteTodo] = useMutation(DELETE_TODO)

  const state = {
    ...data,
    loading,
    error,
    modal
  }

  const value = {
    ...state,
    actions: {
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
            updateTodo: {
              ...todo,
              ...update
            }
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: ({ updateTodo }) => {
            setData((state) => ({
              ...state,
              todos: state.todos.map((todo) => {
                if (todo.id === updateTodo.id) {
                  return updateTodo
                }
                return todo
              })
            }))
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
            updateTodo: {
              ...todo,
              ...update
            }
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: ({ updateTodo }) => {
            setData((state) => ({
              ...state,
              todos: state.todos.map((todo) => {
                if (todo.id === updateTodo.id) {
                  return updateTodo
                }
                return todo
              })
            }))
            setLoading(false)
          }
        })
      },
      setTodoDateSpan: (todo: Todo, startDate: Date, endDate: Date, granularity: TodoLevel) => {
        const granularityKey = getGranularityKey(granularity)
        const update = {
          id: todo.id,
          startDate: startDate.getTime() / 1000,
          endDate: endDate.getTime() / 1000,
          [granularityKey]: true
        }
        console.log('about to set date span', update, todo)
        setLoading(true)
        updateTodo({
          variables: { todo: update },
          optimisticResponse: {
            updateTodo: {
              ...todo,
              ...update,
            }
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: ({ updateTodo }) => {
            setData((state) => ({
              ...state,
              todos: state.todos.map((todo) => {
                if (todo.id === updateTodo.id) {
                  return updateTodo
                }
                return todo
              })
            }))
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
            const { board, todos } = data.moveBoardForwardByWeek
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              todos: todos
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
            const { board, todos } = data.moveBoardBackwardByWeek
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              todos: todos
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
      showModal: (todoId: string) => {
        setModal({ visible: true, todoId})
      },
      hideModal: () => {
        setModal({ visible: false, todoId: null })
      },
      deleteTodo: (todoId: string) => {
        setLoading(true)
        deleteTodo({
          variables: {
            boardId: state.board.id,
            todoId
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: (data) => {
            const { board, todos } = data.deleteTodo
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              todos: todos
            })
            setLoading(false)
          }
        })
      },
      addTodo: (listStartDate: Date, listEndDate: Date) => {
        setLoading(true)
        addTodo({
          variables: {
            boardId: state.board.id,
            startDate: listStartDate.getTime() / 1000,
            endDate: listEndDate.getTime() / 1000
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: (data) => {
            const { board, todos } = data.addTodo
            setData({
              board: {
                ...board,
                startDate: (board.startDate * 1000)
              },
              todos
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