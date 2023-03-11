import React, {useState} from 'react';
import { DndContext } from "@dnd-kit/core";
import {
  todoBoard,
  todoMap,
  todoListMap,
} from './testData'
import {TodoItemBoard} from "./components/TodoItemBoard/TodoItemBoard";
import { TodoList, Todo } from 'atomic-todo-server/src/generated/graphql'

function App() {
  const [lists, setLists] = useState<Map<string, TodoList>>(todoListMap)
  const [todos, setTodos] = useState<Map<string, Todo>>(todoMap)

  function handleDragEnd(event: any) {
    const { active: { id : todoKey }, over: { id : listKey } } = event
    const [todoLevel, todoId] = todoKey.split('_')
    const [listLevel, listId] = listKey.split('_')
    const levels =  ['Day', 'Week', 'Month']
    const newListMap = new Map<string, TodoList>([...lists.entries()].map(([id, list]) => {
      if (id === listId) {
        return [id, {...list, todos: [...new Set([...list.todos, todoId])]}]
      } else if (levels.indexOf(list.level) > levels.indexOf(listLevel)) {
        return [id, list]
      } else {
        return [id, { ...list, todos: list.todos.filter((x: string) => x !== todoId)}]
      }
    }))
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
