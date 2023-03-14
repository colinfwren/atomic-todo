import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {TraversalDirection, UpdateOperation} from "../../types";
import { TodoList } from "@atomic-todo/server/dist/src/generated/graphql";
import {updateLists} from "../../functions/listUpdates";
import {TodoItemBoard} from "../TodoItemBoard/TodoItemBoard";
import React, {useContext} from "react";
import AppContext from "../../contexts/AppContext";

/**
 * Container for drag and drop in app
 * @constructor
 */
export function Container() {
  const { lists, actions: { setLists }} = useContext(AppContext)

  /**
   * Callback for when a drag 'n' drop operation has ended
   *
   * @param {DragEndEvent} event - The drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    console.log(event)
    const { active: todo, over: list } = event
    if (list) {
      const {todoId, sourceListId} = todo.data.current!
      const {listId: targetListId} = list.data.current!
      const newListMap = [
        [sourceListId, UpdateOperation.REMOVE, TraversalDirection.PARENTS],
        [sourceListId, UpdateOperation.REMOVE, TraversalDirection.CHILDREN],
        [targetListId, UpdateOperation.ADD, TraversalDirection.PARENTS]
      ].reduce((listMap: Map<string, TodoList>, [listId, operation, direction]) => {
        return updateLists(listId, todoId, listMap, operation, direction)
      }, lists)
      setLists(newListMap)
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