import {Todo, TodoBoard, TodoLevel, TodoList} from "./generated/graphql";

const todos: Todo[] = [
  {
    id: '1',
    name: 'Set up Apollo Server',
    completed: true
  },
  {
    id: '2',
    name: 'Set up Apollo Codegen',
    completed: true
  },
  {
    id: '3',
    name: 'Use types generated from GraphQL in TypeScript',
    completed: true
  },
  {
    id: '4',
    name: 'Set up schema for Atomic Todo',
    completed: true
  },
  {
    id: '5',
    name: 'Create test data for Atomic Todo schema',
    completed: true
  },
  {
    id: '6',
    name: 'Take over the world',
    completed: false
  }
]

const days: TodoList[] = [
  {
    id: '1',
    name: 'Monday',
    level: TodoLevel.Day,
    todos: [todos[0], todos[1]]
  },
  {
    id: '2',
    name: 'Tuesday',
    level: TodoLevel.Day,
    todos: [todos[2]]
  },
  {
    id: '3',
    name: 'Wednesday',
    level: TodoLevel.Day,
    todos: []
  },
  {
    id: '4',
    name: 'Thursday',
    level: TodoLevel.Day,
    todos: []
  },
  {
    id: '5',
    name: 'Friday',
    level: TodoLevel.Day,
    todos: []
  },
  {
    id: '6',
    name: 'Saturday',
    level: TodoLevel.Day,
    todos: []
  },
  {
    id: '7',
    name: 'Sunday',
    level: TodoLevel.Day,
    todos: []
  }
]

const weeks: TodoList[] = [
  {
    id: '8',
    name: '1 Week',
    level: TodoLevel.Week,
    todos: [todos[0], todos[1], todos[2]]
  },
  {
    id: '9',
    name: '2 Weeks',
    level: TodoLevel.Week,
    todos: [todos[3], todos[4]]
  },
  {
    id: '10',
    name: '3 Weeks',
    level: TodoLevel.Week,
    todos: [todos[5]]
  },
  {
    id: '11',
    name: '4 Weeks',
    level: TodoLevel.Week,
    todos: []
  },
  {
    id: '12',
    name: '5 Weeks',
    level: TodoLevel.Week,
    todos: []
  },
  {
    id: '13',
    name: '6 Weeks',
    level: TodoLevel.Week,
    todos: []
  }
]

const months: TodoList[] = [
  {
    id: '14',
    name: '1 Month',
    level: TodoLevel.Month,
    todos
  },
  {
    id: '15',
    name: '2 Months',
    level: TodoLevel.Month,
    todos: []
  },
  {
    id: '16',
    name: '3 Months',
    level: TodoLevel.Month,
    todos: []
  },
  {
    id: '17',
    name: '4 Months',
    level: TodoLevel.Month,
    todos: []
  },
  {
    id: '18',
    name: '5 Months',
    level: TodoLevel.Month,
    todos: []
  },
  {
    id: '19',
    name: '6 Months',
    level: TodoLevel.Month,
    todos: []
  }
]

export const todoBoard: TodoBoard = {
  id: '1',
  name: 'Test Board',
  days,
  weeks,
  months
}