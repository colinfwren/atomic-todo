import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {Client, Databases, ID, Models, Query} from 'node-appwrite';
import {readFileSync} from 'fs'
import {
  Resolvers,
  Todo,
  TodoBoard,
  TodoBoardResult,
  TodoLevel,
  TodoList,
  TodoListUpdateInput,
  TodoUpdateInput
} from './generated/graphql'

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })

const apiKey = process.env.API_KEY;

const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('atomic-todo')
  .setKey(apiKey)

const databases = new Databases(client);

const DATABASE_ID = 'atomic-todo'
const TODOBOARD_COL_ID = 'todoboards'
const TODOLIST_COL_ID = 'todolists'
const TODO_COL_ID = 'todos'
type TodoBoardDoc = Models.Document & TodoBoard
type TodoListDoc = Models.Document & TodoList
type TodoDoc = Models.Document & Todo

async function updateTodoListDoc(todoList: TodoListUpdateInput): Promise<TodoList> {
  const { id, ...values } = todoList
  const doc: TodoListDoc = await databases.updateDocument(DATABASE_ID, TODOLIST_COL_ID, id, values)
  return {
    id: doc.$id,
    level: doc.level,
    todos: doc.todos,
    parentList: doc.parentList,
    childLists: doc.childLists,
    startDate: doc.startDate
  }
}

async function updateTodoDoc(todo: TodoUpdateInput): Promise<Todo> {
  const { id, ...values } = todo
  const doc: TodoDoc = await databases.updateDocument(DATABASE_ID, TODO_COL_ID, id, values)
  return {
    id: doc.$id,
    name: doc.name,
    completed: doc.completed
  }
}

async function getTodoBoard(id: string): Promise<TodoBoardResult> {
  const boardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, id)
  const listDocs = await databases.listDocuments(DATABASE_ID, TODOLIST_COL_ID, [Query.equal('$id', [ ...boardDoc.days, ...boardDoc.weeks, ...boardDoc.months])])
  const lists = listDocs.documents.map((doc: TodoListDoc) => {
    return {
      id: doc.$id,
      level: doc.level,
      todos: doc.todos,
      parentList: doc.parentList,
      childLists: doc.childLists,
      startDate: doc.startDate
    }
  })
  const todoIds = listDocs.documents.reduce((todoIds: Set<string>, doc: TodoListDoc) => {
    return new Set([...todoIds, ...doc.todos])
  }, new Set())
  const todoDocs = await databases.listDocuments(DATABASE_ID, TODO_COL_ID, [Query.equal('$id', [...todoIds])])
  const todos = todoDocs.documents.map((doc: TodoDoc) => {
    return {
      id: doc.$id,
      name: doc.name,
      completed: doc.completed === null ? false : doc.completed
    }
  })
  return {
    board: {
      name: boardDoc.name,
      days: boardDoc.days,
      weeks: boardDoc.weeks,
      months: boardDoc.months,
      id: boardDoc.$id,
      startDate: boardDoc.startDate
    },
    lists,
    todos
  }
}

async function processMonths(boardDoc: TodoBoardDoc, newBoardDate: Date): Promise<TodoBoardDoc> {
  const currentBoardDate = new Date(boardDoc.startDate)
  const monthDelta = newBoardDate.getMonth() - currentBoardDate.getMonth()
  if (monthDelta > 0) {
    const monthData: Omit<TodoList, 'id'> = {
      startDate: new Date(newBoardDate.getFullYear(), (newBoardDate.getMonth() + 6), 1, 0, 0, 0, 0).toISOString(),
      childLists: [],
      todos: [],
      level: TodoLevel.Month
    }
    const newMonth = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), monthData)
    return {
      ...boardDoc,
      months: [ ...boardDoc.months.slice(1, 6), newMonth.$id]
    }
  }
  return boardDoc
}

async function processWeeks(boardDoc: TodoBoardDoc): Promise<TodoBoardDoc> {
  const currentLastWeekDoc: TodoListDoc = await databases.getDocument(DATABASE_ID, TODOLIST_COL_ID, boardDoc.weeks[5])
  const currentLastWeekDate = new Date(currentLastWeekDoc.startDate)
  const newLastWeekDate = new Date(currentLastWeekDate)
  newLastWeekDate.setDate(newLastWeekDate.getDate() + 7)
  const monthForNewLastWeekDate = new Date(newLastWeekDate)
  monthForNewLastWeekDate.setDate(1)
  const monthForNewLastWeek = await databases.listDocuments(
    DATABASE_ID,
    TODOLIST_COL_ID,
    [
      Query.equal('level', TodoLevel.Month),
      Query.equal('startDate', monthForNewLastWeekDate.toISOString())
    ]
  )
  const newLastWeekData: Omit<TodoList, 'id'> = {
    startDate: newLastWeekDate.toISOString(),
    todos: [],
    childLists: [],
    level: TodoLevel.Week,
    parentList: monthForNewLastWeek.documents[0].$id
  }
  const newLastWeek = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), newLastWeekData)
  return {
    ...boardDoc,
    weeks: [ ...boardDoc.weeks.slice(1, 6), newLastWeek.$id]
  }
}

async function processDays(boardDoc: TodoBoardDoc, newStartDate: Date): Promise<TodoBoardDoc> {
  const newDayIds = await Promise.all([0, 1, 2, 3, 4, 5, 6].map(async (daysToAdd) => {
    const newDayDate = new Date(newStartDate)
    newDayDate.setDate(newDayDate.getDate() + daysToAdd)
    const newDayData: Omit<TodoList, 'id'> = {
      startDate: newDayDate.toISOString(),
      todos: [],
      childLists: [],
      parentList: boardDoc.weeks[0],
      level: TodoLevel.Day
    }
    const newDay = await databases.createDocument(DATABASE_ID, TODOLIST_COL_ID, ID.unique(), newDayData)
    return newDay.$id
  }))
  return {
    ...boardDoc,
    days: newDayIds
  }
}

async function progressBoardByWeek(boardId: string): Promise<TodoBoardResult> {
  const boardDoc: TodoBoardDoc = await databases.getDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId)
  const newStartDate = new Date(boardDoc.startDate)
  newStartDate.setDate(newStartDate.getDate() + 7)
  const boardWithMonths = await processMonths(boardDoc, newStartDate)
  const boardWithWeeks = await processWeeks(boardWithMonths)
  const boardWithDays = await processDays(boardWithWeeks, newStartDate)
  // TODO: replace the above with a nice async pipe
  const newBoardData: Omit<TodoBoard, 'id'> = {
    name: boardWithDays.name,
    days: boardWithDays.days,
    weeks: boardWithDays.weeks,
    months: boardWithDays.months,
    startDate: newStartDate.toISOString()
  }
  const updatedBoard = await databases.updateDocument(DATABASE_ID, TODOBOARD_COL_ID, boardId, newBoardData)
  return getTodoBoard(updatedBoard.$id)
}

const resolvers: Resolvers = {
  Query: {
    getTodoBoard: async (_, { id }) => getTodoBoard(id),
  },
  Mutation: {
    updateTodoList: async (_, { todoList }) => await updateTodoListDoc(todoList),
    updateTodo: async (_, { todo }) => await updateTodoDoc(todo),
    updateTodoLists: async (_, { todoLists }) => await Promise.all(todoLists.map(async (todoList) => await updateTodoListDoc(todoList))),
    updateTodos: async (_, { todos }) => await Promise.all(todos.map(async (todo) => await updateTodoDoc(todo))),
    progressBoardByWeek: async (_, { boardId }) => await progressBoardByWeek(boardId)
  }
}


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);