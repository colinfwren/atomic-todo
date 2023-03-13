import React from 'react'
import { useDroppable } from "@dnd-kit/core";
import {TodoItem} from "../TodoItem/TodoItem";
import styles from './TodoItemList.module.css'
import { TodoItemListProps } from "../../types";

/**
 * Render a TodoList
 *
 * @param {TodoItemListProps} props - Props passed into the component
 * @param {string} props.id - ID of the TodoList
 * @param {string} props.name - Name of the TodoList
 * @param {TodoLevel} props.level - Level of the TodoBoard that the TodoList is rendered under
 * @param {Map<string, Todo>} props.todosMap - Map of Todos
 * @constructor
 */
export function TodoItemList({ id, name, todos, level, todosMap }: TodoItemListProps): JSX.Element {
  const { isOver, setNodeRef } = useDroppable({
    id: `${level}_${id}`,
    data: {
      listId: id
    }
  })
  const style = isOver ? {
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(0,0,0,0.8)',
  } : undefined
  const todoItems = todos.map((todoId: string) => {
    const todo = todosMap.get(todoId)
    return todo ? <TodoItem {...todo} key={todo.id} level={level} listId={id} /> : null
  })
  return (
    <div className={styles.todoItemList}>
      <h3>{ name }</h3>
      <div ref={setNodeRef} style={style} className={styles.listContainer}>
        {todoItems}
      </div>
    </div>
  )
}