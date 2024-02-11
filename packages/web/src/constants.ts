import {gql} from "@apollo/client";

export const API_TOKEN_LOCAL_STORAGE_KEY = 'apiToken'

export const GET_TODOBOARDS_QUERY = gql`
  query getTodoBoards {
    getTodoBoards {
      id
      name
    }
  }
`;

export const GET_TODOBOARD_QUERY = gql`
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

export const UPDATE_TODO_MUTATION = gql`
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

export const UPDATE_TODOS_MUTATION = gql`
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

export const MOVE_BOARD_FORWARD_BY_WEEK_MUTATION = gql`
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

export const MOVE_BOARD_BACKWARD_BY_WEEK_MUTATION = gql`
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

export const UPDATE_BOARD_NAME_MUTATION = gql`
mutation UpdateBoardName($boardNameUpdate: BoardNameUpdateInput!) {
  updateBoardName(boardNameUpdate: $boardNameUpdate) {
    name
  }
}
`

export const ADD_TODO_MUTATION = gql`
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

export const DELETE_TODO_MUTATION = gql`
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