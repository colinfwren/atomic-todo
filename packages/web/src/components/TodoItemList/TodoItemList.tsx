import React, {useContext} from 'react'
import {useDroppable} from "@dnd-kit/core";
import styles from './TodoItemList.module.css'
import { TodoItemListProps } from "../../types";
import AppContext from "../../contexts/AppContext";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableTodoItem} from "../SortableTodoItem/SortableTodoItem";
import {TodoItemListTitle} from "../TodoItemListTitle/TodoItemListTitle";

/**
 * Render a TodoList
 *
 * @param {TodoItemListProps} props - Props passed into the component
 * @param {string} props.id - ID of the TodoList
 * @param {TodoLevel} props.level - Level of the TodoBoard that the TodoList is rendered under
 * @param {Date} props.currentDate - The current date
 * @constructor
 */
export function TodoItemList({ id, level, currentDate }: TodoItemListProps): JSX.Element | null {
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
    const todoIds = list.todos.map((todoId) => `${level}_${todoId}`)
    return (
      <div className={styles.todoItemList}>
        <TodoItemListTitle list={list} currentDate={currentDate} />
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} style={style} className={styles.listContainer}>
            {list.todos.map((todoId: string, index) => <SortableTodoItem id={todoId} key={todoId} level={level} listId={id} index={index} />)}
          </div>
        </SortableContext>
      </div>
    )
  }
  return null
}