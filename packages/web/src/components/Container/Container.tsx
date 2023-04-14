import {DndContext, DragEndEvent} from "@dnd-kit/core";
import { updateTodoListMap} from "../../functions/listUpdates";
import {TodoItemBoard} from "../TodoItemBoard/TodoItemBoard";
import React, {useContext} from "react";
import AppContext from "../../contexts/AppContext";

/**
 * Container for drag and drop in app
 *
 * @returns {JSX.Element} Drag 'n' Drop wrapper over TodoItemBoard
 */
export function Container(): JSX.Element {
  const { lists, actions: { setLists }} = useContext(AppContext)

  /**
   * Callback for when a drag 'n' drop operation has ended
   *
   * @param {DragEndEvent} event - The drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active: todo, over: list } = event
    if (list) {
      setLists(
        updateTodoListMap(
          todo.data.current!.sourceListId,
          list.data.current!.listId,
          todo.data.current!.todoId,
          lists
        )
      )
    }
  }

  return(
    <DndContext onDragEnd={handleDragEnd}>
      <div className="App">
        <TodoItemBoard />
      </div>
    </DndContext>
  )
}