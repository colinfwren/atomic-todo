import {AppTodoBoard, TodoItemList, TodoListEra} from "./types";
import {Todo, TodoBoard, TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {Models} from "appwrite";

export const todoBoard: AppTodoBoard = {
  id: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2',
  name: 'Todo List',
  startDate: new Date('1988-01-11T00:00:00.000+00:00'),
  months: [],
  weeks: [],
  days: []
}

export const todo1: Todo = {
  id: '720889f6-d143-4cd3-a2e3-929a671ad309',
  name: 'Todo 1',
  completed: false,
  deleted: false,
  startDate: 568944000,
  endDate: 569030400,
  posInYear: 1,
  posInMonth: 1,
  posInWeek: 1,
  posInDay: 1,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const todo2: Todo = {
  id: '1dca2003-2594-45ed-8dae-83a58536b1e7',
  name: 'Todo 2',
  completed: false,
  deleted: false,
  startDate: 568944000,
  endDate: 569030400,
  posInYear: 2,
  posInMonth: 2,
  posInWeek: 2,
  posInDay: 2,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const todo3: Todo = {
  id: 'b72394af-6dc5-49d3-bbc6-3ccffaa4bf5b',
  name: 'Todo 3',
  completed: false,
  deleted: false,
  startDate: 568944000,
  endDate: 569030400,
  posInYear: 3,
  posInMonth: 3,
  posInWeek: 3,
  posInDay: 3,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const todoMap= new Map<string, Todo>([
  [todo1.id, todo1],
  [todo2.id, todo2]
])

const nov2023Start = 1698796800
const nov2023End = 1701388800
const week462023Start = 1699833600
const week462023End = 1700438400
const day13Nov2023Start = 1699833600
const day13Nov2023End = 1699920000
const week482023Start = 1701043200
const week482023End = 1701648000
const week522023Start = 1703462400
const week522023End = 1704067200

export const monthTodo: Todo = {
  id: 'month-todo',
  name: 'Month Todo',
  completed: false,
  deleted: false,
  startDate: nov2023Start,
  endDate: nov2023End,
  posInYear: 1,
  posInMonth: 1,
  posInWeek: 0,
  posInDay: 0,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}
export const dayTodo: Todo = {
  id: 'day-todo',
  name: 'Day Todo',
  completed: false,
  deleted: false,
  startDate: day13Nov2023Start,
  endDate: day13Nov2023End,
  posInYear: 2,
  posInMonth: 2,
  posInWeek: 1,
  posInDay: 1,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const week462023Todo: Todo = {
  id: 'week-46-2023-todo',
  name: 'Week 46 of 2023 Todo',
  completed: false,
  deleted: false,
  startDate: week462023Start,
  endDate: week462023End,
  posInYear: 3,
  posInMonth: 3,
  posInWeek: 2,
  posInDay: 0,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}
export const week482023Todo: Todo = {
   id: 'week-48-2023-todo',
  name: 'Week 48 of 2023 Todo',
  completed: false,
  deleted: false,
  startDate: week482023Start,
  endDate: week482023End,
  posInYear: 4,
  posInMonth: 4,
  posInWeek: 1,
  posInDay: 0,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const week522023Todo: Todo = {
   id: 'week-52-2023-todo',
  name: 'Week 52 of 2023 Todo',
  completed: false,
  deleted: false,
  startDate: week522023Start,
  endDate: week522023End,
  posInYear: 5,
  posInMonth: 1,
  posInWeek: 1,
  posInDay: 0,
  showInYear: true,
  showInMonth: true,
  showInWeek: true
}

export const dayListOnlyTodo: Todo = {
  id: 'day-only-todo',
  name: 'Day list only Todo',
  completed: false,
  deleted: false,
  startDate: day13Nov2023Start,
  endDate: day13Nov2023End,
  posInYear: 0,
  posInMonth: 0,
  posInWeek: 0,
  posInDay: 2,
  showInYear: false,
  showInMonth: false,
  showInWeek: false
}
export const dayWeekListOnlyTodo: Todo = {
  id: 'day-and-week-only-todo',
  name: 'Day and Week lists only Todo',
  completed: false,
  deleted: false,
  startDate: day13Nov2023Start,
  endDate: day13Nov2023End,
  posInYear: 0,
  posInMonth: 0,
  posInWeek: 3,
  posInDay: 3,
  showInYear: false,
  showInMonth: false,
  showInWeek: true
}

export const testTodos = [
  monthTodo,
  week462023Todo,
  week482023Todo,
  week522023Todo,
  dayTodo,
  dayListOnlyTodo,
  dayWeekListOnlyTodo
]

export const testTodoMap = new Map<string, Todo>(testTodos.map((todo) => [todo.id, todo]))

export const day1List: TodoItemList = {
  id: `${TodoLevel.Day}-0`,
  listStartDate: new Date(2023, 10, 13, 0, 0, 0),
  listEndDate: new Date(2023, 10, 14, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [dayTodo.id, dayListOnlyTodo.id, dayWeekListOnlyTodo.id],
  era: TodoListEra.current
}

export const day2List: TodoItemList = {
  id: `${TodoLevel.Day}-1`,
  listStartDate: new Date(2023, 10, 14, 0, 0, 0),
  listEndDate: new Date(2023, 10, 15, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const day3List: TodoItemList = {
  id: `${TodoLevel.Day}-2`,
  listStartDate: new Date(2023, 10, 15, 0, 0, 0),
  listEndDate: new Date(2023, 10, 16, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const day4List: TodoItemList = {
  id: `${TodoLevel.Day}-3`,
  listStartDate: new Date(2023, 10, 16, 0, 0, 0),
  listEndDate: new Date(2023, 10, 17, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const day5List: TodoItemList = {
  id: `${TodoLevel.Day}-4`,
  listStartDate: new Date(2023, 10, 17, 0, 0, 0),
  listEndDate: new Date(2023, 10, 18, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const day6List: TodoItemList = {
  id: `${TodoLevel.Day}-5`,
  listStartDate: new Date(2023, 10, 18, 0, 0, 0),
  listEndDate: new Date(2023, 10, 19, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const day7List: TodoItemList = {
  id: `${TodoLevel.Day}-6`,
  listStartDate: new Date(2023, 10, 19, 0, 0, 0),
  listEndDate: new Date(2023, 10, 20, 0,0,0),
  granularity: TodoLevel.Day,
  todos: [],
  era: TodoListEra.future
}

export const week1List: TodoItemList = {
  id: `${TodoLevel.Week}-0`,
  listStartDate: new Date(2023, 10, 13, 0, 0, 0),
  listEndDate: new Date(2023, 10, 20, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [dayTodo.id, week462023Todo.id, dayWeekListOnlyTodo.id],
  era: TodoListEra.future
}

export const week2List: TodoItemList = {
  id: `${TodoLevel.Week}-1`,
  listStartDate: new Date(2023, 10, 20, 0, 0, 0),
  listEndDate: new Date(2023, 10, 27, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [],
  era: TodoListEra.future
}

export const week3List: TodoItemList = {
  id: `${TodoLevel.Week}-2`,
  listStartDate: new Date(2023, 10, 27, 0, 0, 0),
  listEndDate: new Date(2023, 11, 4, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [week482023Todo.id],
  era: TodoListEra.future
}

export const week4List: TodoItemList = {
  id: `${TodoLevel.Week}-3`,
  listStartDate: new Date(2023, 11, 4, 0, 0, 0),
  listEndDate: new Date(2023, 11,  11, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [],
  era: TodoListEra.future
}

export const week5List: TodoItemList = {
  id: `${TodoLevel.Week}-4`,
  listStartDate: new Date(2023, 11, 11, 0, 0, 0),
  listEndDate: new Date(2023, 11,  18, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [],
  era: TodoListEra.future
}

export const week6List: TodoItemList = {
  id: `${TodoLevel.Week}-5`,
  listStartDate: new Date(2023, 11, 18, 0, 0, 0),
  listEndDate: new Date(2023, 11,  25, 0,0,0),
  granularity: TodoLevel.Week,
  todos: [],
  era: TodoListEra.future
}

export const month1List: TodoItemList = {
  id: `${TodoLevel.Month}-0`,
  listStartDate: new Date(2023, 10, 1, 0, 0, 0),
  listEndDate: new Date(2023, 11,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [monthTodo.id, dayTodo.id, week462023Todo.id, week482023Todo.id],
  era: TodoListEra.future
}

export const month2List: TodoItemList = {
  id: `${TodoLevel.Month}-1`,
  listStartDate: new Date(2023, 11, 1, 0, 0, 0),
  listEndDate: new Date(2024, 0,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [week522023Todo.id],
  era: TodoListEra.future
}

export const month3List: TodoItemList = {
  id: `${TodoLevel.Month}-2`,
  listStartDate: new Date(2024, 0, 1, 0, 0, 0),
  listEndDate: new Date(2024, 1,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [],
  era: TodoListEra.future
}

export const month4List: TodoItemList = {
  id: `${TodoLevel.Month}-3`,
  listStartDate: new Date(2024, 1, 1, 0, 0, 0),
  listEndDate: new Date(2024, 2,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [],
  era: TodoListEra.future
}

export const month5List: TodoItemList = {
  id: `${TodoLevel.Month}-4`,
  listStartDate: new Date(2024, 2, 1, 0, 0, 0),
  listEndDate: new Date(2024, 3,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [],
  era: TodoListEra.future
}

export const month6List: TodoItemList = {
  id: `${TodoLevel.Month}-5`,
  listStartDate: new Date(2024, 3, 1, 0, 0, 0),
  listEndDate: new Date(2024, 4,  1, 0,0,0),
  granularity: TodoLevel.Month,
  todos: [],
  era: TodoListEra.future
}

export const testTodoItemListMap = new Map<string, TodoItemList>([
  [day1List.id, day1List],
  [day2List.id, day2List],
  [day3List.id, day3List],
  [day4List.id, day4List],
  [day5List.id, day5List],
  [day6List.id, day6List],
  [day7List.id, day7List],
  [week1List.id, week1List],
  [week2List.id, week2List],
  [week3List.id, week3List],
  [week4List.id, week4List],
  [week5List.id, week5List],
  [week6List.id, week6List],
  [month1List.id, month1List],
  [month2List.id, month2List],
  [month3List.id, month3List],
  [month4List.id, month4List],
  [month5List.id, month5List],
  [month6List.id, month6List],
])

export const testUserAccount: Models.User<Models.Preferences> = {
  $id: 'user-id-1',
  $createdAt: '1988-01-12T00:00:00.000Z',
  $updatedAt: '1988-01-12T00:00:00.000Z',
  name: 'Test User 1',
  registration: '',
  status: true,
  labels: [],
  password: '',
  passwordUpdate: '',
  email: '',
  phone: '',
  emailVerification: false,
  phoneVerification: false,
  prefs: {},
  accessedAt: '1988-01-12T00:00:00.000Z'
}

export const testEmailSession: Models.Session = {
  $id: 'user-1-session-1',
  $createdAt: '1988-01-12T00:00:00.000Z',
  userId: testUserAccount.$id,
  expire: '1988-01-12T:00:00:00.000Z',
  provider: '',
  providerUid: '',
  providerAccessToken: '',
  providerAccessTokenExpiry: '1988-01-12T00:00:00.000Z',
  providerRefreshToken: '',
  ip: '',
  osCode: '',
  osName: '',
  osVersion: '',
  clientCode: '',
  clientName: '',
  clientType: '',
  clientVersion: '',
  clientEngine: '',
  clientEngineVersion: '',
  deviceBrand: '',
  deviceModel: '',
  deviceName: '',
  countryCode: '',
  countryName: '',
  current: true
}

export const testTodoBoard: TodoBoard = {
  id: 'todoboard-1',
  name: 'Todoboard 1',
  startDate: 568944000
}