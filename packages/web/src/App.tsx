import React from 'react';
import { AppProvider } from "./contexts/AppContext";
import {Container} from "./components/Container/Container";
import './app.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

/**
 * The Atomic Todo Web App
 * @constructor
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <AppProvider>
        <Container />
      </AppProvider>
    </ApolloProvider>
  );
}

export default App;
