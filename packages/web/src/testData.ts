// @ts-ignore
import {Todo, TodoBoard, TodoLevel, TodoList} from '@atomic-todo/server/dist/src/generated/graphql'
import {FormattedTodoList} from "./types";

export const DAY_ONE_ID = 'a7990dea-3b26-4b28-964c-e84b7fa88440'
export const DAY_TWO_ID = 'fe8235a0-8419-47d7-883c-409579e10253'
export const WEEK_ONE_ID = '773c5148-df9f-4dc3-b69b-009e7e95006f'
export const WEEK_TWO_ID = '05936db3-0d8a-41a8-955b-200e0c2084ef'
export const WEEK_FIVE_ID = 'cc011fa8-db0d-4690-ae5d-3a1ac5b5381c'
export const WEEK_SIX_ID = 'a56583c2-01ee-4c3a-a623-70532c12466c'
export const MONTH_ONE_ID = 'f6aaa969-7bc8-47c8-98b1-05b663940265'
export const MONTH_TWO_ID = 'd2e04b10-5888-43d7-b9c8-3d77b115c8fa'
export const TODO_ID = '8722f10a-a26a-4ae9-a855-9c15034c0cf8'
export const TODO_FOUR_ID = '64f8c222-9262-441b-9c9a-d5b8d6bb76cf'
export const TODO_SIX_ID = '5ff13d41-e3cf-461b-829d-598b955476d3'
export const TODO_SEVEN_ID = '1cd9a1a4-232a-4be9-a8be-d0b67ba1af08'

const todos: Todo[] = [
  {
    id: TODO_ID,
    name: 'Set up Apollo Server',
    completed: true
  },
  {
    id: 'c6d2ada5-3f82-42be-bb07-cc03d2b0ff87',
    name: 'Set up Apollo Codegen',
    completed: true
  },
  {
    id: '2d9814bb-efdd-443a-9cc9-ef73c22591d7',
    name: 'Use types generated from GraphQL in TypeScript',
    completed: true
  },
  {
    id: TODO_FOUR_ID,
    name: 'Set up schema for Atomic Todo',
    completed: true
  },
  {
    id: '65bfb1e4-d041-49b5-8fe9-4f6bd2a37682',
    name: 'Create test data for Atomic Todo schema',
    completed: true
  },
  {
    id: TODO_SIX_ID,
    name: 'The same thing we do every friday night',
    completed: false
  },
  {
    id: TODO_SEVEN_ID,
    name: 'Try to take over the world',
    completed: false
  }
]

const days: FormattedTodoList[] = [
  {
    id: DAY_ONE_ID,
    level: TodoLevel.Day,
    todos: [todos[0].id, todos[1].id],
    childLists: [],
    parentList: WEEK_ONE_ID,
    name: 'Mon',
    date: '03/04',
    startDate: '2023-04-03T00:00:00.000+00:00'
  },
  {
    id: DAY_TWO_ID,
    name: 'Tue',
    date: '04/04',
    level: TodoLevel.Day,
    todos: [todos[2].id],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-04T00:00:00.000+00:00'
  },
  {
    id: 'adcb06ab-2f63-446d-b88c-ff521870e77a',
    name: 'Wed',
    date: '05/04',
    level: TodoLevel.Day,
    todos: [],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-05T00:00:00.000+00:00'
  },
  {
    id: '6ad1f977-48ba-471b-8a73-a58225fc848f',
    name: 'Thu',
    date: '06/04',
    level: TodoLevel.Day,
    todos: [],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-06T00:00:00.000+00:00'
  },
  {
    id: 'f90ea05c-4b2b-4082-ab84-68ca423688b1',
    name: 'Fri',
    date: '07/04',
    level: TodoLevel.Day,
    todos: [],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-07T00:00:00.000+00:00'
  },
  {
    id: '6c842ea8-3a35-45c7-91e9-4ff41410f151',
    name: 'Sat',
    date: '08/04',
    level: TodoLevel.Day,
    todos: [],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-08T00:00:00.000+00:00'
  },
  {
    id: '9db1ebc4-4a14-433c-8c40-20c9f42674f2',
    name: 'Sun',
    date: '09/04',
    level: TodoLevel.Day,
    todos: [],
    childLists: [],
    parentList: WEEK_ONE_ID,
    startDate: '2023-04-09T00:00:00.000+00:00'
  }
]

const weeks: FormattedTodoList[] = [
  {
    id: WEEK_ONE_ID,
    name: '1 Week',
    date: '03/04',
    level: TodoLevel.Week,
    todos: [todos[0].id, todos[1].id, todos[2].id],
    parentList: MONTH_ONE_ID,
    childLists: days.map(x => x.id),
    startDate: '2023-04-03T00:00:00.000+00:00'
  },
  {
    id: WEEK_TWO_ID,
    name: '2 Weeks',
    date: '10/04',
    level: TodoLevel.Week,
    todos: [todos[3].id, todos[4].id],
    parentList: MONTH_ONE_ID,
    childLists: [],
    startDate: '2023-04-10T00:00:00.000+00:00'
  },
  {
    id: '48276bee-0e50-4cb8-90a9-b12dcce9fd3f',
    name: '3 Weeks',
    date: '17/04',
    level: TodoLevel.Week,
    todos: [],
    parentList: MONTH_ONE_ID,
    childLists: [],
    startDate: '2023-04-17T00:00:00.000+00:00'
  },
  {
    id: '34a1432e-b45e-4f94-b57c-18c3b0efb7ec',
    name: '4 Weeks',
    date: '24/04',
    level: TodoLevel.Week,
    todos: [],
    parentList: MONTH_ONE_ID,
    childLists: [],
    startDate: '2023-04-24T00:00:00.000+00:00'
  },
  {
    id: WEEK_FIVE_ID,
    name: '5 Weeks',
    date: '01/08',
    level: TodoLevel.Week,
    todos: [todos[5].id],
    parentList: MONTH_TWO_ID,
    childLists: [],
    startDate: '2023-05-01T00:00:00.000+00:00'
  },
  {
    id: WEEK_SIX_ID,
    name: '6 Weeks',
    date: '08/05',
    level: TodoLevel.Week,
    todos: [],
    parentList: MONTH_TWO_ID,
    childLists: [],
    startDate: '2023-05-08T00:00:00.000+00:00'
  }
]

const months: FormattedTodoList[] = [
  {
    id: MONTH_ONE_ID,
    name: '1 Month',
    date: 'Apr',
    level: TodoLevel.Month,
    todos: [
      todos[0].id,
      todos[1].id,
      todos[2].id,
      todos[3].id,
      todos[4].id,
    ],
    parentList: null,
    childLists: [
      weeks[0].id,
      weeks[1].id,
      weeks[2].id,
      weeks[3].id,
    ],
    startDate: '2023-04-01T00:00:00.000+00:00'
  },
  {
    id: MONTH_TWO_ID,
    name: '2 Months',
    date: 'May',
    level: TodoLevel.Month,
    todos: [
      todos[5].id,
      todos[6].id
    ],
    parentList: null,
    childLists: [
      weeks[4].id,
      weeks[5].id
    ],
    startDate: '2023-05-01T00:00:00.000+00:00'
  },
  {
    id: 'c52f1cc7-9c90-47dc-8ee5-2b11b620b9e0',
    name: '3 Months',
    date: 'Jun',
    level: TodoLevel.Month,
    todos: [],
    parentList: null,
    childLists: [],
    startDate: '2023-06-01T00:00:00.000+00:00'
  },
  {
    id: 'cf27c8e5-f1ec-48a9-870a-29e4f9cb2f49',
    name: '4 Months',
    date: 'Jul',
    level: TodoLevel.Month,
    todos: [],
    parentList: null,
    childLists: [],
    startDate: '2023-07-01T00:00:00.000+00:00'
  },
  {
    id: '3bf422e1-2ebe-41f1-9bfc-a08ea5fb937b',
    name: '5 Months',
    date: 'Aug',
    level: TodoLevel.Month,
    todos: [],
    parentList: null,
    childLists: [],
    startDate: '2023-08-01T00:00:00.000+00:00'
  },
  {
    id: '78527bc8-13b0-4ed3-b9ba-96b40715cd75',
    name: '6 Months',
    date: 'Sep',
    level: TodoLevel.Month,
    todos: [],
    parentList: null,
    childLists: [],
    startDate: '2023-09-01T00:00:00.000+00:00'
  }
]

export const todoListMap = new Map<string, FormattedTodoList>([...days, ...weeks, ...months].map((list => {
  return [list.id, list]
})))

export const todoMap = new Map<string, Todo>(todos.map(todo => {
  return [todo.id, todo]
}))

export const todoBoard: TodoBoard = {
  id: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2',
  name: 'Todo List',
  days: days.map(x => x.id),
  weeks: weeks.map(x => x.id),
  months: months.map(x => x.id),
  startDate: '2023-04-03T00:00:00.000+00:00'
}

export const emptyTodoListMap = new Map<string, FormattedTodoList>([...days, ...weeks, ...months].map((list => {
  return [list.id, { ...list, todos: []}]
})))

export const emptyTodoMap = new Map<string, Todo>([])