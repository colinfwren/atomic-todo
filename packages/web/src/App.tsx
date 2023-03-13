import React, {useState} from 'react';
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {todoBoard, todoListMap, todoMap,} from './testData'
import {TodoItemBoard} from "./components/TodoItemBoard/TodoItemBoard";
import {Todo, TodoList} from '@atomic-todo/server/src/generated/graphql'
import {TraversalDirection, UpdateOperation} from "./types";
import {updateLists} from "./functions/listUpdates";

/**
 * The Atomic Todo Web App
 * @constructor
 */
function App() {
  const [lists, setLists] = useState<Map<string, TodoList>>(todoListMap)
  const [todos] = useState<Map<string, Todo>>(todoMap)

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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="App">
        <TodoItemBoard {...todoBoard} todos={todos} lists={lists} />
      </div>
    </DndContext>
  );
}

export default App;
