import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {readFileSync} from 'fs'
import {
  Resolvers
} from './generated/graphql'
import {todoBoard, todoLists, todos} from "./testData";

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })



const resolvers: Resolvers = {
  Query: {
    todoBoards: () => {
      return [todoBoard]
    },
    todoLists: () => {
      return todoLists
    },
    todos: () => {
      return todos
    }
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