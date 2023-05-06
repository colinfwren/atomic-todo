import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {Client, Databases} from 'node-appwrite';
import {readFileSync} from 'fs'
import {Resolvers} from './generated/graphql'
import {getTodoBoard, moveBoardByWeek, updateTodoBoardDoc, updateTodoDoc, updateTodoListDoc,} from "./functions";
import {BoardMoveDirection} from "./types";

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })

const apiKey = process.env.API_KEY;

const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('atomic-todo')
  .setKey(apiKey)

const databases = new Databases(client);

const resolvers: Resolvers = {
  Query: {
    getTodoBoard: async (_, { id }) => getTodoBoard(databases, id),
  },
  Mutation: {
    updateTodoList: async (_, { todoList }) => await updateTodoListDoc(databases, todoList),
    updateTodo: async (_, { todo }) => await updateTodoDoc(databases, todo),
    updateTodoLists: async (_, { todoLists }) => await Promise.all(todoLists.map(async (todoList) => await updateTodoListDoc(databases, todoList))),
    updateTodos: async (_, { todos }) => await Promise.all(todos.map(async (todo) => await updateTodoDoc(databases, todo))),
    moveBoardForwardByWeek: async (_, { boardId }) => await moveBoardByWeek(databases, boardId, BoardMoveDirection.FORWARD),
    moveBoardBackwardByWeek: async (_, { boardId }) => await moveBoardByWeek(databases, boardId, BoardMoveDirection.BACK),
    updateBoardName: async (_, { boardNameUpdate }) => await updateTodoBoardDoc(databases, boardNameUpdate),
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