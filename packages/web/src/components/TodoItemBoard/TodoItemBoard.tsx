import React from 'react'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'
import { TodoItemBoardProps } from "../../types";

/**
 * Render a board of Todo Lists
 *
 * @param {TodoItemBoardProps} props - Props passed into the component
 * @param {string} props.name - The name of the Todo board
 * @param {TodoList[]} props.days - A list of TodoLists to render in the Days section
 * @oaram {TodoList[]} props.weeks - A list of TodoLists to render in the Weeks section
 * @param {TodoList[]} props.months - A list of TodoLists to render in the Months section
 * @oaram {Map<string, TodoList>} props.lists - A Map of TodoLists
 * @param {Map<string, Todo>} props.todos - A Map of Todos
 * @constructor
 */
export function TodoItemBoard({ name, days, weeks, months, lists, todos }: TodoItemBoardProps): JSX.Element {

  const dayLists = days.map((listId: string) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })
  const weekLists = weeks.map((listId: string) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })
  const monthLists = months.map((listId: string) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })

  return (
    <div className={styles.todoItemBoard}>
      <h1>{ name }</h1>
      <div className={styles.days}>
        <h2>Days</h2>
        <div>
          {dayLists}
        </div>
      </div>
      <div className={styles.weeks}>
        <h2>Weeks</h2>
        <div>
          {weekLists}
        </div>
      </div>
      <div className={styles.months}>
        <h2>Months</h2>
        <div>
          {monthLists}
        </div>
      </div>
    </div>
  )
}