const todos = [
  {
    id: '8722f10a-a26a-4ae9-a855-9c15034c0cf8',
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
    id: '64f8c222-9262-441b-9c9a-d5b8d6bb76cf',
    name: 'Set up schema for Atomic Todo',
    completed: true
  },
  {
    id: '5ff13d41-e3cf-461b-829d-598b955476d3',
    name: 'Create test data for Atomic Todo schema',
    completed: true
  },
  {
    id: '65bfb1e4-d041-49b5-8fe9-4f6bd2a37682',
    name: 'Take over the world',
    completed: false
  }
]

const days = [
  {
    id: 'a7990dea-3b26-4b28-964c-e84b7fa88440',
    name: 'Monday',
    level: 'Day' as any,
    todos: [todos[0].id, todos[1].id]
  },
  {
    id: 'fe8235a0-8419-47d7-883c-409579e10253',
    name: 'Tuesday',
    level: 'Day' as any,
    todos: [todos[2].id]
  },
  {
    id: 'adcb06ab-2f63-446d-b88c-ff521870e77a',
    name: 'Wednesday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '6ad1f977-48ba-471b-8a73-a58225fc848f',
    name: 'Thursday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: 'f90ea05c-4b2b-4082-ab84-68ca423688b1',
    name: 'Friday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '6c842ea8-3a35-45c7-91e9-4ff41410f151',
    name: 'Saturday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '9db1ebc4-4a14-433c-8c40-20c9f42674f2',
    name: 'Sunday',
    level: 'Day' as any,
    todos: []
  }
]

const weeks = [
  {
    id: '773c5148-df9f-4dc3-b69b-009e7e95006f',
    name: '1 Week',
    level: 'Week' as any,
    todos: [todos[0].id, todos[1].id, todos[2].id]
  },
  {
    id: '05936db3-0d8a-41a8-955b-200e0c2084ef',
    name: '2 Weeks',
    level: 'Week' as any,
    todos: [todos[3].id, todos[4].id]
  },
  {
    id: '48276bee-0e50-4cb8-90a9-b12dcce9fd3f',
    name: '3 Weeks',
    level: 'Week' as any,
    todos: [todos[5].id]
  },
  {
    id: '34a1432e-b45e-4f94-b57c-18c3b0efb7ec',
    name: '4 Weeks',
    level: 'Week' as any,
    todos: []
  },
  {
    id: 'cc011fa8-db0d-4690-ae5d-3a1ac5b5381c',
    name: '5 Weeks',
    level: 'Week' as any,
    todos: []
  },
  {
    id: 'a56583c2-01ee-4c3a-a623-70532c12466c',
    name: '6 Weeks',
    level: 'Week' as any,
    todos: []
  }
]

const months = [
  {
    id: 'f6aaa969-7bc8-47c8-98b1-05b663940265',
    name: '1 Month',
    level: 'Month' as any,
    todos: todos.map(x => x.id)
  },
  {
    id: 'd2e04b10-5888-43d7-b9c8-3d77b115c8fa',
    name: '2 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: 'c52f1cc7-9c90-47dc-8ee5-2b11b620b9e0',
    name: '3 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: 'cf27c8e5-f1ec-48a9-870a-29e4f9cb2f49',
    name: '4 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '3bf422e1-2ebe-41f1-9bfc-a08ea5fb937b',
    name: '5 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '78527bc8-13b0-4ed3-b9ba-96b40715cd75',
    name: '6 Months',
    level: 'Month' as any,
    todos: []
  }
]

export const todoListMap = new Map([...days, ...weeks, ...months].map((list => {
  return [list.id, list]
})))

export const todoMap = new Map(todos.map(todo => {
  return [todo.id, todo]
}))

export const todoBoard = {
  id: '5769fdc6-d2fd-4526-8955-5cf6fe6a14e2',
  name: 'Test Board',
  days: days.map(x => x.id),
  weeks: weeks.map(x => x.id),
  months: months.map(x => x.id)
}