import React from "react";
import {Container} from "../components/Container/Container";
import {TodoBoardProvider} from "../contexts/TodoBoardContext";
import {useParams} from "react-router-dom";

/**
 * Page for TodoBoard
 * @constructor
 */
export function TodoBoardPage() {
  const { todoboardId } = useParams()
  return (
    <TodoBoardProvider boardId={todoboardId as string}>
      <Container />
    </TodoBoardProvider>
  )
}