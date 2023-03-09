import React from 'react';
import { todoBoard } from './testData'
import {TodoItemBoard} from "./components/TodoItemBoard/TodoItemBoard";

function App() {
  return (
    <div className="App">
      <TodoItemBoard {...todoBoard} />
    </div>
  );
}

export default App;
