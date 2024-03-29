import {readFileSync} from "fs";
import {Resolvers} from "./generated/graphql";
import {
  addTodo, addTodoBoard,
  deleteTodo,
  getTodoBoard,
  getTodoBoards,
  moveBoardByWeek,
  updateTodo,
  updateTodoBoard
} from "./functions";
import {BoardMoveDirection} from "./types";
import {Account, Client, Databases, Models} from "node-appwrite";
import {ListenOptions} from "node:net";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })

const resolvers: Resolvers = {
  Query: {
    getTodoBoard: async (_, { id }, { databases }) => getTodoBoard(databases, id),
    getTodoBoards: async (_, args, { databases }) => getTodoBoards(databases)
  },
  Mutation: {
    updateTodo: async (_, { todo }, { databases }) => await updateTodo(databases, todo),
    updateTodos: async (_, { todos }, { databases }) => await Promise.all(todos.map(async (todo) => await updateTodo(databases, todo))),
    moveBoardForwardByWeek: async (_, { boardId }, { databases }) => await moveBoardByWeek(databases, boardId, BoardMoveDirection.FORWARD),
    moveBoardBackwardByWeek: async (_, { boardId }, { databases }) => await moveBoardByWeek(databases, boardId, BoardMoveDirection.BACK),
    updateBoardName: async (_, { boardNameUpdate }, { databases }) => await updateTodoBoard(databases, boardNameUpdate),
    addTodo: async (_, { boardId, startDate, endDate, positions}, { databases, user }) => await addTodo(databases, user, boardId, startDate, endDate, positions),
    deleteTodo: async (_, { boardId, todoId }, { databases }) => await deleteTodo(databases, boardId, todoId),
    addTodoBoard: async (_, args, { databases, user }) => await addTodoBoard(databases, user)
  }
}

interface ServerContext {
  client: Client
  databases: Databases
  user: Models.User<Models.Preferences>
}

export async function createApolloServer(listenOptions: ListenOptions = { port: 4000 }) {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer<ServerContext>({
    typeDefs,
    resolvers,
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res}) => {
      if (req.headers.host === 'localhost:4000') {
        return
      }
      const token = req.headers.authorization.replace('Bearer ', '') || ''
      const client = new Client()
        .setEndpoint('http://localhost/v1')
        .setProject('atomic-todo')
        .setJWT(token)
      const databases = new Databases(client)
      const account = new Account(client)
      const user = await account.get()
      return {
        client,
        databases,
        user
      }
    },
    listen: listenOptions,
  });
  return { server, url }
}