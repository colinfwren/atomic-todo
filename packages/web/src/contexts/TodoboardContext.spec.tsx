import {render, waitFor} from "@testing-library/react";
import {MockedProvider, MockedResponse} from "@apollo/client/testing";
import {useContext} from "react";
import {
  ADD_TODO_MUTATION,
  DELETE_TODO_MUTATION,
  GET_TODOBOARD_QUERY,
  MOVE_BOARD_BACKWARD_BY_WEEK_MUTATION,
  MOVE_BOARD_FORWARD_BY_WEEK_MUTATION,
  UPDATE_BOARD_NAME_MUTATION,
  UPDATE_TODO_MUTATION,
  UPDATE_TODOS_MUTATION
} from "../constants";
import {dayTodo, month1List, monthTodo, testTodoBoard, testTodos} from "../testData";
import TodoBoardContext, {initialTodoBoardState, TodoBoardProvider} from "./TodoBoardContext";
import {getAppStateFromTodoBoardResult} from "../functions/getAppStateFromTodoBoardResult";
import {ModalProps, TodoBoardState} from "../types";
import {act} from "react-dom/test-utils";
import {getTodoMapFromUpdate, getTodoMapFromUpdates} from "../functions/getTodoMapFromUpdate";
import {Todo, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const BOARD_TEST_ID = 'board'
const LISTS_TEST_ID = 'lists'
const TODOS_TEST_ID = 'todos'
const MODAL_TEST_ID = 'modal'
const LOADING_TEST_ID = 'loading'
const ERROR_TEST_ID = 'error'
const SET_APP_STATE_TEST_ID = 'setAppState'
const SET_TODO_COMPLETED_TEST_ID = 'setTodoCompleted'
const SET_TODO_NAME_TEST_ID = 'setTodoName'
const SET_TODO_DATE_SPAN_TEST_ID = 'setTodoDateSpan'
const UPDATE_TODOS_TEST_ID = 'updateTodos'
const ADD_TODO_TEST_ID = 'addTodo'
const DELETE_TODO_TEST_ID = 'deleteTodo'
const SET_BOARD_NAME_TEST_ID = 'setBoardName'
const MOVE_BOARD_FORWARD_BY_WEEK_TEST_ID = 'moveBoardForwardByWeek'
const MOVE_BOARD_BACKWARD_BY_WEEK_TEST_ID = 'moveBoardBackwardByWeek'
const SHOW_MODAL_TEST_ID = 'showModal'
const HIDE_MODAL_TEST_ID = 'hideModal'
const ERROR_MESSAGE = 'oh noes'

const UPDATED_TODO_NAME = 'Updated Todo'
const MILLISECONDS_IN_WEEK = 604800

const EMPTY_MODAL_STATE: ModalProps = {
  visible: false,
  todoId: null
}

const INITIAL_DATA_FETCH_MOCK = {
  request: {
    query: GET_TODOBOARD_QUERY,
    variables: {
      boardId: testTodoBoard.id
    }
  },
  result: {
    data: {
      getTodoBoard: {
        board: testTodoBoard,
        todos: testTodos
      }
    }
  }
}

const INITIAL_POST_FETCH_APP_STATE = getAppStateFromTodoBoardResult(INITIAL_DATA_FETCH_MOCK.result.data.getTodoBoard)

function TodoBoardContextValues() {
  const { board, lists, todos, modal, actions, loading, error } = useContext(TodoBoardContext)
  return (
    <>
      <p data-testid={BOARD_TEST_ID}>{JSON.stringify(board)}</p>
      <p data-testid={LISTS_TEST_ID}>{JSON.stringify(lists)}</p>
      <p data-testid={TODOS_TEST_ID}>{JSON.stringify(todos)}</p>
      <p data-testid={MODAL_TEST_ID}>{JSON.stringify(modal)}</p>
      <p data-testid={LOADING_TEST_ID}>{JSON.stringify(loading)}</p>
      <p data-testid={ERROR_TEST_ID}>{JSON.stringify(error)}</p>
      <button data-testid={SET_APP_STATE_TEST_ID} onClick={() => actions.setAppState(initialTodoBoardState)}>Set App State</button>
      <button data-testid={SET_TODO_COMPLETED_TEST_ID} onClick={() => actions.setTodoCompleted(dayTodo, !dayTodo.completed)}>Set Todo Completed</button>
      <button data-testid={SET_TODO_NAME_TEST_ID} onClick={() => actions.setTodoName(dayTodo, UPDATED_TODO_NAME)}>Set Todo Name</button>
      <button data-testid={SET_TODO_DATE_SPAN_TEST_ID} onClick={() => actions.setTodoDateSpan(dayTodo, new Date(monthTodo.startDate * 1000), new Date(monthTodo.endDate * 1000), TodoLevel.Month)}>Set Todo Date Span</button>
      <button data-testid={UPDATE_TODOS_TEST_ID} onClick={() => actions.updateTodos([{ ...dayTodo, posInMonth: 1}, { ...monthTodo, posInMonth: 2}])}>Update Todos</button>
      <button data-testid={ADD_TODO_TEST_ID} onClick={() => actions.addTodo(month1List.listStartDate, month1List.listEndDate, [{ granularity: TodoLevel.Month, position: 1 }, { granularity: TodoLevel.Week, position: 1 }, { granularity: TodoLevel.Day, position: 1 }])}>Add Todo</button>
      <button data-testid={DELETE_TODO_TEST_ID}  onClick={() => actions.deleteTodo(dayTodo.id)}>Delete Todo</button>
      <button data-testid={SET_BOARD_NAME_TEST_ID} onClick={() => actions.setBoardName('Updated board name')}>Set Board Name</button>
      <button data-testid={MOVE_BOARD_FORWARD_BY_WEEK_TEST_ID} onClick={() => actions.moveBoardForward()}>Move Board Forward</button>
      <button data-testid={MOVE_BOARD_BACKWARD_BY_WEEK_TEST_ID} onClick={() => actions.moveBoardBackward()}>Move Board Backward</button>
      <button data-testid={SHOW_MODAL_TEST_ID} onClick={() => actions.showModal(dayTodo.id)}>Show Modal</button>
      <button data-testid={HIDE_MODAL_TEST_ID} onClick={() => actions.hideModal()}>Hide Modal</button>
    </>
  )
}

function todoBoardTest(mocks: MockedResponse<Record<string, any>, Record<string, any>>[]) {
  return render(
    <MockedProvider mocks={mocks}>
      <TodoBoardProvider boardId={testTodoBoard.id}>
        <TodoBoardContextValues />
      </TodoBoardProvider>
    </MockedProvider>
  )
}

async function runTest(mocks: MockedResponse<Record<string, any>, Record<string, any>>[], expectedAppState: TodoBoardState, modalState: ModalProps = EMPTY_MODAL_STATE, errorMessage: string = 'null') {
  const { getByTestId } = todoBoardTest(mocks)
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
  expect(getByTestId(BOARD_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.board))
  expect(getByTestId(LISTS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.lists))
  expect(getByTestId(TODOS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.todos))
  expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify(modalState))
  expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent(errorMessage)
}

async function runTestWithAction(mocks: MockedResponse<Record<string, any>, Record<string, any>>[], expectedAppState: TodoBoardState, actionTestId: string, modalState: ModalProps = EMPTY_MODAL_STATE, errorMessage: string = 'null') {
  const {getByTestId} = todoBoardTest(mocks)
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
  act(() => getByTestId(actionTestId).click())
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
  await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
  expect(getByTestId(BOARD_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.board))
  expect(getByTestId(LISTS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.lists))
  expect(getByTestId(TODOS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.todos))
  expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify(modalState))
  expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent(errorMessage)
}

describe('TodoboardContext', () => {
  describe('Loading TodoBoard data', () => {
    it('provides the todoboard and todos when fetching todoboard for user', async () => {
      const expectedAppState = INITIAL_POST_FETCH_APP_STATE
      const mocks = [INITIAL_DATA_FETCH_MOCK]
      await runTest(mocks, expectedAppState)
    })
    it('provides the error message if there is an issue fetching boards for user', async () => {
      const expectedAppState = initialTodoBoardState
      const mocks = [
        {
          request: INITIAL_DATA_FETCH_MOCK.request,
          error: new Error(ERROR_MESSAGE)
        }
      ]
      await runTest(mocks, expectedAppState, EMPTY_MODAL_STATE, ERROR_MESSAGE)
    })
    describe('setAppState action', () => {
      it('provides updated app state when the setAppState action is called', async () => {
        const expectedAppState = initialTodoBoardState
        const mocks = [INITIAL_DATA_FETCH_MOCK]
        const { getByTestId } = todoBoardTest(mocks)
        await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
        await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
        act(() => getByTestId(SET_APP_STATE_TEST_ID).click())
        expect(getByTestId(BOARD_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.board))
        expect(getByTestId(LISTS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.lists))
        expect(getByTestId(TODOS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.todos))
        expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify(EMPTY_MODAL_STATE))
        expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent('null')
      })
    })
  })
  describe('Updating Todos', () => {
    describe('setTodoCompleted', () => {
      it('provides app state with updated todo when the setTodoCompleted action is called', async () => {
        const updatedTodo = {
          ...dayTodo,
          completed: !dayTodo.completed
        }
        const expectedAppState = {
          ...INITIAL_POST_FETCH_APP_STATE,
          todos: getTodoMapFromUpdate(INITIAL_POST_FETCH_APP_STATE.todos, updatedTodo)
        }
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  name: dayTodo.name,
                  completed: !dayTodo.completed
                }
              }
            },
            result: {
              data: {
                updateTodo: updatedTodo
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_COMPLETED_TEST_ID)
      })
      it('provides error message when the setTodoCompleted action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  name: dayTodo.name,
                  completed: !dayTodo.completed
                }
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_COMPLETED_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('setTodoName', () => {
      it('provides app state with updated todo when the setTodoName action is called', async () => {
        const updatedTodo = {
          ...dayTodo,
          name: UPDATED_TODO_NAME
        }
        const expectedAppState = {
          ...INITIAL_POST_FETCH_APP_STATE,
          todos: getTodoMapFromUpdate(INITIAL_POST_FETCH_APP_STATE.todos, updatedTodo)
        }
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  name: UPDATED_TODO_NAME,
                  completed: dayTodo.completed
                }
              }
            },
            result: {
              data: {
                updateTodo: updatedTodo
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_NAME_TEST_ID)
      })
      it('provides error message when the setTodoName action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  name: UPDATED_TODO_NAME,
                  completed: dayTodo.completed
                }
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_NAME_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('setTodoDateSpan', () => {
      it('provides app state with updated todo when the setTodoDateSpan action is called', async () => {
        const updatedTodo = {
          ...dayTodo,
          startDate: monthTodo.startDate,
          endDate: monthTodo.endDate,
          granularity: TodoLevel.Month
        }
        const expectedAppState = {
          ...INITIAL_POST_FETCH_APP_STATE,
          todos: getTodoMapFromUpdate(INITIAL_POST_FETCH_APP_STATE.todos, updatedTodo)
        }
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  startDate: updatedTodo.startDate,
                  endDate: updatedTodo.endDate,
                  showInMonth: true
                }
              }
            },
            result: {
              data: {
                updateTodo: updatedTodo
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_DATE_SPAN_TEST_ID)
      })
      it('provides error message when the setTodoDateSpan action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODO_MUTATION,
              variables: {
                todo: {
                  id: dayTodo.id,
                  startDate: monthTodo.startDate,
                  endDate: monthTodo.endDate,
                  showInMonth: true
                }
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_TODO_DATE_SPAN_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('updateTodos', () => {
      it('provides app state with updated todos when the updateTodos action is called', async () => {
        const updatedTodos = [
          {
            ...dayTodo,
            posInMonth: 1
          },
          {
            ...monthTodo,
            posInMonth: 2
          }
        ]
        const expectedAppState = {
          ...INITIAL_POST_FETCH_APP_STATE,
          todos: getTodoMapFromUpdates(INITIAL_POST_FETCH_APP_STATE.todos, updatedTodos)
        }
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODOS_MUTATION,
              variables: {
                todos: [
                  {
                    id: dayTodo.id,
                    startDate: dayTodo.startDate,
                    endDate: dayTodo.endDate,
                    posInDay: dayTodo.posInDay,
                    posInWeek: dayTodo.posInWeek,
                    posInMonth: 1,
                    showInWeek: dayTodo.showInWeek,
                    showInMonth: dayTodo.showInMonth
                  },
                  {
                    id: monthTodo.id,
                    startDate: monthTodo.startDate,
                    endDate: monthTodo.endDate,
                    posInDay: monthTodo.posInDay,
                    posInWeek: monthTodo.posInWeek,
                    posInMonth: 2,
                    showInWeek: monthTodo.showInWeek,
                    showInMonth: monthTodo.showInMonth
                  }
                ]
              }
            },
            result: {
              data: {
                updateTodos: updatedTodos
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, UPDATE_TODOS_TEST_ID)
      })
      it('provides error message when the updateTodos action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_TODOS_MUTATION,
              variables: {
                todos: [
                  {
                    id: dayTodo.id,
                    startDate: dayTodo.startDate,
                    endDate: dayTodo.endDate,
                    posInDay: dayTodo.posInDay,
                    posInWeek: dayTodo.posInWeek,
                    posInMonth: 1,
                    showInWeek: dayTodo.showInWeek,
                    showInMonth: dayTodo.showInMonth
                  },
                  {
                    id: monthTodo.id,
                    startDate: monthTodo.startDate,
                    endDate: monthTodo.endDate,
                    posInDay: monthTodo.posInDay,
                    posInWeek: monthTodo.posInWeek,
                    posInMonth: 2,
                    showInWeek: monthTodo.showInWeek,
                    showInMonth: monthTodo.showInMonth
                  }
                ]
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, UPDATE_TODOS_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('addTodo', () => {
      it('provides app state with updated todo list when the addTodo action is called', async () => {
        const addedTodo: Todo = {
          id: 'added-todo',
          name: 'Added Todo',
          completed: false,
          startDate: month1List.listStartDate.getTime() / 1000,
          endDate: month1List.listEndDate.getTime() / 1000,
          showInYear: true,
          showInMonth: true,
          showInWeek: true,
          posInYear: 1,
          posInMonth: 1,
          posInWeek: 1,
          posInDay: 1,
          deleted: false
        }
        const updateTodoBoard = {
          board: testTodoBoard,
          todos: [ ...testTodos, addedTodo]
        }
        const expectedAppState = getAppStateFromTodoBoardResult(updateTodoBoard)
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: ADD_TODO_MUTATION,
              variables: {
                boardId: testTodoBoard.id,
                startDate: month1List.listStartDate.getTime() / 1000,
                endDate: month1List.listEndDate.getTime() / 1000,
                positions: [
                  { granularity: TodoLevel.Month, position: 1 },
                  { granularity: TodoLevel.Week, position: 1 },
                  { granularity: TodoLevel.Day, position: 1 },
                ]
              }
            },
            result: {
              data: {
                addTodo: updateTodoBoard
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, ADD_TODO_TEST_ID)
      })
      it('provides error message when the addTodo action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: ADD_TODO_MUTATION,
              variables: {
                boardId: testTodoBoard.id,
                startDate: month1List.listStartDate.getTime() / 1000,
                endDate: month1List.listEndDate.getTime() / 1000,
                positions: [
                  { granularity: TodoLevel.Month, position: 1 },
                  { granularity: TodoLevel.Week, position: 1 },
                  { granularity: TodoLevel.Day, position: 1 },
                ]
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, ADD_TODO_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('deleteTodo', () => {
      it('provides app state with updated todo list when the deleteTodo action is called', async () => {
        const updateTodoBoard = {
          board: testTodoBoard,
          todos: testTodos.filter((todo) => todo.id !== dayTodo.id)
        }
        const expectedAppState = getAppStateFromTodoBoardResult(updateTodoBoard)
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: DELETE_TODO_MUTATION,
              variables: {
                boardId: testTodoBoard.id,
                todoId: dayTodo.id
              }
            },
            result: {
              data: {
                deleteTodo: updateTodoBoard
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, DELETE_TODO_TEST_ID)
      })
      it('provides error message when the deleteTodo action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: DELETE_TODO_MUTATION,
              variables: {
                boardId: testTodoBoard.id,
                todoId: dayTodo.id
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, DELETE_TODO_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
  })
  describe('Updating TodoBoard', () => {
    describe('setBoardName', () => {
      it('provides app state with updated board name when the setBoardName action is called', async () => {
        const updateTodoBoard = {
          board: {
            ...testTodoBoard,
            name: 'Updated board name'
          },
          todos: testTodos
        }
        const expectedAppState = getAppStateFromTodoBoardResult(updateTodoBoard)
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_BOARD_NAME_MUTATION,
              variables: {
                boardNameUpdate: {
                  id: testTodoBoard.id,
                  name: updateTodoBoard.board.name
                }
              }
            },
            result: {
              data: {
                updateBoardName: {
                  name: updateTodoBoard.board.name
                }
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_BOARD_NAME_TEST_ID)
      })
      it('provides error message when the setBoardName action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: UPDATE_BOARD_NAME_MUTATION,
              variables: {
                boardNameUpdate: {
                  id: testTodoBoard.id,
                  name: 'Updated board name'
                }
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, SET_BOARD_NAME_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('moveBoardForwardByWeek', () => {
      it('provides app state with updated board when the moveBoardForwardByWeek action is called', async () => {
        const updateTodoBoard = {
          board: {
            ...testTodoBoard,
            startDate: testTodoBoard.startDate + MILLISECONDS_IN_WEEK
          },
          todos: testTodos
        }
        const expectedAppState = getAppStateFromTodoBoardResult(updateTodoBoard)
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: MOVE_BOARD_FORWARD_BY_WEEK_MUTATION,
              variables: {
                boardId: testTodoBoard.id
              }
            },
            result: {
              data: {
                moveBoardForwardByWeek: updateTodoBoard
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, MOVE_BOARD_FORWARD_BY_WEEK_TEST_ID)
      })
      it('provides error message when the moveBoardForwardByWeek action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: MOVE_BOARD_FORWARD_BY_WEEK_MUTATION,
              variables: {
                boardId: testTodoBoard.id
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, MOVE_BOARD_FORWARD_BY_WEEK_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
    describe('moveBoardBackwardByWeek', () => {
      it('provides app state with updated board when the moveBoardBackwardByWeek action is called', async () => {
        const updateTodoBoard = {
          board: {
            ...testTodoBoard,
            startDate: testTodoBoard.startDate - MILLISECONDS_IN_WEEK
          },
          todos: testTodos
        }
        const expectedAppState = getAppStateFromTodoBoardResult(updateTodoBoard)
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: MOVE_BOARD_BACKWARD_BY_WEEK_MUTATION,
              variables: {
                boardId: testTodoBoard.id
              }
            },
            result: {
              data: {
                moveBoardBackwardByWeek: updateTodoBoard
              }
            }
          }
        ]
        await runTestWithAction(mocks, expectedAppState, MOVE_BOARD_BACKWARD_BY_WEEK_TEST_ID)
      })
      it('provides error message when the moveBoardBackwardByWeek action is called and fails', async () => {
        const expectedAppState = INITIAL_POST_FETCH_APP_STATE
        const mocks = [
          INITIAL_DATA_FETCH_MOCK,
          {
            request: {
              query: MOVE_BOARD_BACKWARD_BY_WEEK_MUTATION,
              variables: {
                boardId: testTodoBoard.id
              }
            },
            error: new Error(ERROR_MESSAGE)
          }
        ]
        await runTestWithAction(mocks, expectedAppState, MOVE_BOARD_BACKWARD_BY_WEEK_TEST_ID, EMPTY_MODAL_STATE, ERROR_MESSAGE)
      })
    })
  })
  describe('Modal state', () => {
    it('provides the modal visibility and active Todo ID when the modal is active', async () => {
      const expectedAppState = INITIAL_POST_FETCH_APP_STATE
      const mocks = [INITIAL_DATA_FETCH_MOCK]
      const { getByTestId } = todoBoardTest(mocks)
      await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
      await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
      act(() => getByTestId(SHOW_MODAL_TEST_ID).click())
      expect(getByTestId(BOARD_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.board))
      expect(getByTestId(LISTS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.lists))
      expect(getByTestId(TODOS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.todos))
      expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify({ visible: true, todoId: dayTodo.id }))
      expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent('null')
    })
    it('provides the modal visibility and clears the Todo ID when the modal is hidden', async () => {
      const expectedAppState = INITIAL_POST_FETCH_APP_STATE
      const mocks = [INITIAL_DATA_FETCH_MOCK]
      const { getByTestId } = todoBoardTest(mocks)
      await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('true'))
      await waitFor(() => expect(getByTestId(LOADING_TEST_ID)).toHaveTextContent('false'))
      act(() => getByTestId(SHOW_MODAL_TEST_ID).click())
      expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify({ visible: true, todoId: dayTodo.id }))
      act(() => getByTestId(HIDE_MODAL_TEST_ID).click())
      expect(getByTestId(BOARD_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.board))
      expect(getByTestId(LISTS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.lists))
      expect(getByTestId(TODOS_TEST_ID)).toHaveTextContent(JSON.stringify(expectedAppState.todos))
      expect(getByTestId(MODAL_TEST_ID)).toHaveTextContent(JSON.stringify(EMPTY_MODAL_STATE))
      expect(getByTestId(ERROR_TEST_ID)).toHaveTextContent('null')
    })
  })
})