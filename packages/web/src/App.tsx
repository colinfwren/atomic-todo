import React from 'react';
import { AppProvider } from "./contexts/AppContext";
import {Container} from "./components/Container/Container";

/**
 * The Atomic Todo Web App
 * @constructor
 */
function App() {
  return (
    <AppProvider>
      <Container />
    </AppProvider>
  );
}

export default App;
