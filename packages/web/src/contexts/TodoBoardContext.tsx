import React, {createContext, useState} from 'react'
import {TodoBoardProviderProps, TodoBoardState, ITodoBoardContext, ModalProps, TodoItemList} from "../types";
import {todoBoard} from "../testData";
// @ts-ignore
import {
  BoardNameUpdateInput,
  Todo,
  TodoLevel,
  TodoPositionInput
} from "@atomic-todo/server/dist/src/generated/graphql";
import {gql, useMutation, useQuery} from "@apollo/client";
import {getAppStateFromTodoBoardResult} from "../functions/getAppStateFromTodoBoardResult";
import {getTodoMapFromUpdate, getTodoMapFromUpdates} from "../functions/getTodoMapFromUpdate";
import {getGranularityVisibilityKey} from "../functions/getGranularityVisibilityKey";

const initialState: TodoBoardState = {
  board: todoBoard,
  lists: new Map<string, TodoItemList>(),
  todos: new Map<string, Todo>()
}

const actions = {
  setAppState: () => {},
  setTodoCompleted: () => {},
  setTodoName: () => {},
  updateTodos: (todos: Todo[]) => {},
  moveBoardForward: () => {},
  moveBoardBackward: () => {},
  setBoardName: () => {},
  addTodo: (listStartDate: Date, listEndDate: Date, positions: TodoPositionInput[]) => {},
  showModal: (todoId: string) => {},
  hideModal: () => {},
  deleteTodo: (todoId: string) => {}
}

const TodoBoardContext = createContext<ITodoBoardContext>({ ...initialState, actions, loading: false, modal: { visible: false, todoId: null }})
const { Provider } = TodoBoardContext

const GET_TODOBOARD = gql`
  query getTodoBoard($boardId: ID!) {
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
        posInMonth
        posInWeek
        posInDay
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
    posInMonth
    posInWeek
    posInDay
  }
}
`;

const UPDATE_TODOS = gql`
mutation updateTodos($todos: [TodoUpdateInput!]!) {
  updateTodos(todos: $todos) {
    id
    name
    completed
    startDate
    endDate
    showInYear
    showInMonth
    showInWeek
    posInMonth
    posInWeek
    posInDay
  }
}`

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
      posInMonth
      posInWeek
      posInDay
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
      posInMonth
      posInWeek
      posInDay
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
mutation addTodo($boardId: ID!, $startDate: Int!, $endDate: Int!, $positions: [TodoPositionInput]!) {
  addTodo(boardId: $boardId, startDate: $startDate, endDate: $endDate, positions: $positions) {
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
      posInMonth
      posInWeek
      posInDay
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
      posInMonth
      posInWeek
      posInDay
    }
  }
}
`

/**
 * Provider for the TodoBoardContext
 *
 * @param {TodoBoardProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 */
export function TodoBoardProvider({ children, boardId }: TodoBoardProviderProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [modal, setModal] = useState<ModalProps>({ visible: false, todoId: null })
  const [data, setData] = useState<TodoBoardState>(initialState)

  useQuery(GET_TODOBOARD, {
    variables: { boardId },
    onCompleted: (data) => {
      setData(getAppStateFromTodoBoardResult(data.getTodoBoard))
      setLoading(false)
    },
    onError: (error) => {
      setError(error.message)
      setLoading(false)
    }
  })

  const [updateTodo] = useMutation(UPDATE_TODO)
  const [updateTodos] = useMutation(UPDATE_TODOS)
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
      setAppState: (newState: TodoBoardState) => {
        setData(newState)
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
              todos: getTodoMapFromUpdate(state.todos, updateTodo)
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
              todos: getTodoMapFromUpdate(state.todos, updateTodo)
            }))
            setLoading(false)
          }
        })
      },
      updateTodos: (todos: Todo[]) => {
        const update = todos.map((todo) => ({
          id: todo.id,
          startDate: todo.startDate,
          endDate: todo.endDate,
          posInDay: todo.posInDay,
          posInWeek: todo.posInWeek,
          posInMonth: todo.posInMonth,
          showInWeek: todo.showInWeek,
          showInMonth: todo.showInMonth
        }))
        setLoading(true)
        updateTodos({
          variables: { todos: update },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted:({ updateTodos }) => {
            setData((state) => ({
              ...state,
              todos: getTodoMapFromUpdates(state.todos, updateTodos)
            }))
            setLoading(false)
          }
        })
      },
      setTodoDateSpan: (todo: Todo, startDate: Date, endDate: Date, granularity: TodoLevel) => {
        const granularityKey = getGranularityVisibilityKey(granularity)
        const update = {
          id: todo.id,
          startDate: startDate.getTime() / 1000,
          endDate: endDate.getTime() / 1000,
          [granularityKey]: true
        }
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
              todos: getTodoMapFromUpdate(state.todos, updateTodo)
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
            setData(getAppStateFromTodoBoardResult(data.moveBoardForwardByWeek))
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
            setData(getAppStateFromTodoBoardResult(data.moveBoardBackwardByWeek))
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
            setData(getAppStateFromTodoBoardResult(data.deleteTodo))
            setLoading(false)
          }
        })
      },
      addTodo: (listStartDate: Date, listEndDate: Date, positions: TodoPositionInput[]) => {
        setLoading(true)
        addTodo({
          variables: {
            boardId: state.board.id,
            startDate: listStartDate.getTime() / 1000,
            endDate: listEndDate.getTime() / 1000,
            positions
          },
          onError: (error) => {
            setError(error.message)
            setLoading(false)
          },
          onCompleted: (data) => {
            setData(getAppStateFromTodoBoardResult(data.addTodo))
            setLoading(false)
          }
        })
      }
    }
  }

  return <Provider value={value}>{children}</Provider>
}

export default TodoBoardContext