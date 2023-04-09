import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {Client, Databases, Models, Query} from 'node-appwrite';
import {readFileSync} from 'fs'
import {
  Resolvers,
  Todo,
  TodoBoard,
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

async function updateTodoListDoc(todoList: TodoListUpdateInput): Promise<TodoList> {
  const { id, ...values } = todoList
  const doc: Models.Document & TodoList = await databases.updateDocument(DATABASE_ID, 'todolists', id, values)
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
  const doc: Models.Document & Todo = await databases.updateDocument(DATABASE_ID, 'todos', id, values)
  return {
    id: doc.$id,
    name: doc.name,
    completed: doc.completed
  }
}

const resolvers: Resolvers = {
  Query: {
    getTodoBoard: async (_, { id }) => {
      const boardDoc: Models.Document & TodoBoard = await databases.getDocument(DATABASE_ID, 'todoboards', id)
      const listDocs = await databases.listDocuments(DATABASE_ID, 'todolists', [Query.equal('$id', [ ...boardDoc.days, ...boardDoc.weeks, ...boardDoc.months])])
      const lists = listDocs.documents.map((doc: Models.Document & TodoList) => {
        return {
          id: doc.$id,
          level: doc.level,
          todos: doc.todos,
          parentList: doc.parentList,
          childLists: doc.childLists,
          startDate: doc.startDate
        }
      })
      const todoIds = listDocs.documents.reduce((todoIds: Set<string>, doc: Models.Document & TodoList) => {
        return new Set([...todoIds, ...doc.todos])
      }, new Set())
      const todoDocs = await databases.listDocuments(DATABASE_ID, 'todos', [Query.equal('$id', [...todoIds])])
      const todos = todoDocs.documents.map((doc: Models.Document & Todo) => {
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
    },
  },
  Mutation: {
    updateTodoList: async (_, { todoList }) => await updateTodoListDoc(todoList),
    updateTodo: async (_, { todo }) => await updateTodoDoc(todo),
    updateTodoLists: async (_, { todoLists }) => await Promise.all(todoLists.map(async (todoList) => await updateTodoListDoc(todoList))),
    updateTodos: async (_, { todos }) => await Promise.all(todos.map(async (todo) => await updateTodoDoc(todo))),
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