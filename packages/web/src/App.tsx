import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { TodoBoardProvider } from "./contexts/TodoBoardContext";
import {Container} from "./components/Container/Container";
import './app.css';
import { HomePage } from "./pages/HompePage";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

const router = createBrowserRouter([
  {
    id: 'root',
    path: "/",
    Component: HomePage,
  }
])

/**
 * The Atomic Todo Web App
 * @constructor
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <TodoBoardProvider>
        <Container />
      </TodoBoardProvider>
    </ApolloProvider>
  );
}

export default App;
