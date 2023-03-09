const todos = [
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

const days = [
  {
    id: '1',
    name: 'Monday',
    level: 'Day' as any,
    todos: [todos[0], todos[1]]
  },
  {
    id: '2',
    name: 'Tuesday',
    level: 'Day' as any,
    todos: [todos[2]]
  },
  {
    id: '3',
    name: 'Wednesday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '4',
    name: 'Thursday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '5',
    name: 'Friday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '6',
    name: 'Saturday',
    level: 'Day' as any,
    todos: []
  },
  {
    id: '7',
    name: 'Sunday',
    level: 'Day' as any,
    todos: []
  }
]

const weeks = [
  {
    id: '8',
    name: '1 Week',
    level: 'Week' as any,
    todos: [todos[0], todos[1], todos[2]]
  },
  {
    id: '9',
    name: '2 Weeks',
    level: 'Week' as any,
    todos: [todos[3], todos[4]]
  },
  {
    id: '10',
    name: '3 Weeks',
    level: 'Week' as any,
    todos: [todos[5]]
  },
  {
    id: '11',
    name: '4 Weeks',
    level: 'Week' as any,
    todos: []
  },
  {
    id: '12',
    name: '5 Weeks',
    level: 'Week' as any,
    todos: []
  },
  {
    id: '13',
    name: '6 Weeks',
    level: 'Week' as any,
    todos: []
  }
]

const months = [
  {
    id: '14',
    name: '1 Month',
    level: 'Month' as any,
    todos
  },
  {
    id: '15',
    name: '2 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '16',
    name: '3 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '17',
    name: '4 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '18',
    name: '5 Months',
    level: 'Month' as any,
    todos: []
  },
  {
    id: '19',
    name: '6 Months',
    level: 'Month' as any,
    todos: []
  }
]

export const todoBoard = {
  id: '1',
  name: 'Test Board',
  days,
  weeks,
  months
}