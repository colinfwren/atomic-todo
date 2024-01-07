import { createApolloServer } from "./server";


if (process.env.NODE_END !== 'test') {
  const runServer = async () => {
    const {url} = await createApolloServer({ port: 4000 });
    console.log(`🚀  Server ready at: ${url}`);
  }
  runServer()
}