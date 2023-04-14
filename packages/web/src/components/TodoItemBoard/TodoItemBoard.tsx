import React, {useContext} from 'react'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'
import AppContext from "../../contexts/AppContext";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Render a board of Todo Lists
 *
 * @constructor
 */
export function TodoItemBoard(): JSX.Element {
  const { board: { name, days, weeks, months }, actions: { progressBoard }, loading} = useContext(AppContext)
  const dayLists = days.map((listId: string) =>  <TodoItemList id={listId} level={TodoLevel.Day} key={listId} />)
  const weekLists = weeks.map((listId: string) => <TodoItemList id={listId} level={TodoLevel.Week} key={listId} />)
  const monthLists = months.map((listId: string) => <TodoItemList id={listId} level={TodoLevel.Month} key={listId} />)

  /**
   * Handle clicking the end of week button
   */
  function onEndOfWeekClick() {
    progressBoard()
  }

  return (
    <div className={styles.todoItemBoard}>
      <div className={styles.header}>
        <h1>{ name }</h1>
        <button type='button' disabled={loading} onClick={onEndOfWeekClick}>End Of Week</button>
      </div>
      <div className={styles.days}>
        <h2>7 Days</h2>
        <div>
          {dayLists}
        </div>
      </div>
      <div className={styles.weeks}>
        <h2>6 Weeks</h2>
        <div>
          {weekLists}
        </div>
      </div>
      <div className={styles.months}>
        <h2>6 Months</h2>
        <div>
          {monthLists}
        </div>
      </div>
    </div>
  )
}