import React, {useState} from 'react';
import {DndContext} from "@dnd-kit/core";
import {todoBoard, todoListMap, todoMap,} from './testData'
import {TodoItemBoard} from "./components/TodoItemBoard/TodoItemBoard";
import {Todo, TodoList} from 'atomic-todo-server/src/generated/graphql'

enum UpdateOperation {
  ADD,
  REMOVE
}

function App() {
  const [lists, setLists] = useState<Map<string, TodoList>>(todoListMap)
  const [todos, setTodos] = useState<Map<string, Todo>>(todoMap)

  function handleDragEnd(event: any) {
    console.log(event)
    const { active: todo, over: list } = event
    const { todoId, sourceListId } = todo.data.current
    const { listId: targetListId } = list.data.current
    const newListMap = new Map<string, TodoList>(lists)

    function updateParentLists(listId: string, operation: UpdateOperation) {
      const currentList = lists.get(listId)!
      if (operation === UpdateOperation.ADD) {
        newListMap.set(listId, {
          ...currentList,
          todos: [...new Set([...currentList.todos, todoId])]
        })
      } else {
        newListMap.set(listId, {
          ...currentList,
          todos: currentList.todos.filter(x => x !== todoId)
        })
      }
      if (currentList.parentList !== null) {
        updateParentLists(currentList.parentList!, operation)
      }
    }

    function updateChildLists(listId: string, operation: UpdateOperation) {
      const currentList = lists.get(listId)!
      if (operation === UpdateOperation.ADD) {
        newListMap.set(listId, {
          ...currentList,
          todos: [...new Set([...currentList.todos, todoId])]
        })
      } else {
        newListMap.set(listId, {
          ...currentList,
          todos: currentList.todos.filter(x => x !== todoId)
        })
      }
      currentList.childLists.forEach((childListId) => {
        updateChildLists(childListId, operation)
      })
    }

    updateParentLists(sourceListId, UpdateOperation.REMOVE)
    updateChildLists(sourceListId, UpdateOperation.REMOVE)

    updateParentLists(targetListId, UpdateOperation.ADD)

    setLists(newListMap)
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
