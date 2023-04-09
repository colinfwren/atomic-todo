import React, {useContext} from 'react'
import { useDroppable } from "@dnd-kit/core";
import {TodoItem} from "../TodoItem/TodoItem";
import styles from './TodoItemList.module.css'
import { TodoItemListProps } from "../../types";
import AppContext from "../../contexts/AppContext";

/**
 * Render a TodoList
 *
 * @param {TodoItemListProps} props - Props passed into the component
 * @param {string} props.id - ID of the TodoList
 * @param {TodoLevel} props.level - Level of the TodoBoard that the TodoList is rendered under
 * @constructor
 */
export function TodoItemList({ id, level }: TodoItemListProps): JSX.Element | null {
  const { lists } = useContext(AppContext)

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

  const list = lists.get(id)
  if (list) {
    const todoItems = list.todos.map((todoId: string) => <TodoItem id={todoId} key={todoId} level={level} listId={id}/>)
    return (
      <div className={styles.todoItemList}>
        <h3>{list.name}</h3>
        <div className={styles.dividerContainer}>
          <div className={styles.divider} />
        </div>
        <div ref={setNodeRef} style={style} className={styles.listContainer}>
          {todoItems}
        </div>
      </div>
    )
  }
  return null
}