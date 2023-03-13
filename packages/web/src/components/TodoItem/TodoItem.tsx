import React from 'react'
import { useDraggable } from "@dnd-kit/core";
import styles from "./TodoItem.module.css"
import { TodoItemProps } from "../../types";

/**
 * Render a Todo
 *
 * @param {TodoItemProps} props - Properties passed into the component
 * @param {string} props.id - ID of the Todo
 * @param {string} props.name - The name of the Todo
 * @param {boolean} props.completed - If the Todo is completed
 * @param {string} props.level - The level of the TodoList the Todo is rendered in
 * @param {string} props.listId - The ID of the TodoList the Todo is rendered in
 * @constructor
 */
export function TodoItem({ id, name, completed, level, listId }: TodoItemProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${level}_${id}`,
    data: {
      sourceListId: listId,
      todoId: id
    }
  })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px,0)`} : undefined
  return (
    <div className={styles.todoItem} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <input type='checkbox' checked={completed} readOnly />
      <p>{ name }</p>
    </div>
  )
}