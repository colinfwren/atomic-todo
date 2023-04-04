import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {Client, Databases} from 'node-appwrite';
import {readFileSync} from 'fs'
import {
  Resolvers
} from './generated/graphql'

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' })

const apiKey = process.env.API_KEY;

const client = new Client()
  .setEndpoint('http://localhost/v1')
  .setProject('atomic-todo')
  .setKey(apiKey)

const databases = new Databases(client);

const DATABASE_ID = 'atomic-todo'

const resolvers: Resolvers = {
  Query: {
    todoBoards: async () => {
      const docs = await databases.listDocuments(DATABASE_ID, 'todoboards')
      return docs.documents.map((doc : any) => {
        return {
          name: doc.name,
          days: doc.days,
          weeks: doc.weeks,
          months: doc.months,
          id: doc.$id
        }
      })
    },
    todoLists: async () => {
      const docs = await databases.listDocuments(DATABASE_ID, 'todolists')
      return docs.documents.map((doc: any) => {
        return {
          id: doc.$id,
          name: doc.name,
          level: doc.level,
          todos: doc.todos,
          parentList: doc.parentList,
          childLists: doc.childLists
        }
      })
    },
    todos: async () => {
      const docs = await databases.listDocuments(DATABASE_ID, 'todos')
      return docs.documents.map((doc: any) => {
        return {
          id: doc.$id,
          name: doc.name,
          completed: doc.completed !== null
        }
      })
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