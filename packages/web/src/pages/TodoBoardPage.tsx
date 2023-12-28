import React from "react";
import {Container} from "../components/Container/Container";
import {TodoBoardProvider} from "../contexts/TodoBoardContext";

/**
 * Page for TodoBoard
 * @constructor
 */
export function TodoBoardPage() {
  return (
    <TodoBoardProvider>
      <Container />
    </TodoBoardProvider>
  )
}