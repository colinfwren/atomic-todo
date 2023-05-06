import React, {useContext, useRef} from 'react'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'
import AppContext from "../../contexts/AppContext";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import { ProgressionButton} from "../ProgressionButton/ProgressionButton";
import {ProgressButtonDirection } from "../../types";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";

/**
 * Render a board of Todo Lists
 *
 * @constructor
 */
export function TodoItemBoard(): JSX.Element {
  const { board: { name, days, weeks, months }, actions: { moveBoardForward, moveBoardBackward, setBoardName }, loading} = useContext(AppContext)
  const boardName = useRef(name)
  const rawDate = new Date()
  const currentDate = new Date(rawDate.toISOString())
  currentDate.setHours(0, 0, 0, 0)
  const dayLists = days
    .map((listId: string) =>  <TodoItemList id={listId} level={TodoLevel.Day} key={listId} currentDate={currentDate} />)
    .reduce((elements: JSX.Element[], list, index, lists) => {
      if (index < 5) {
        return [...elements, list]
      } else if (index === 5) {
        const nextList = lists[6]
        return [
          ...elements,
          (
            <div key={index}>
              {list}
              {nextList}
            </div>
          )
        ]
      } else {
        return elements
      }
    }, [])
  const weekLists = weeks.map((listId: string) => <TodoItemList id={listId} level={TodoLevel.Week} key={listId} currentDate={currentDate} />)
  const monthLists = months.map((listId: string) => <TodoItemList id={listId} level={TodoLevel.Month} key={listId} currentDate={currentDate} />)

  /**
   * Handle clicking the forward button
   */
  function goForwardAWeek() {
    moveBoardForward()
  }

  /**
   * Handle clicking the backward button
   */
  function goBackAWeek() {
    moveBoardBackward()
  }

  /**
   * handle change to TodoBoard name
   */
  function handleChange(event: ContentEditableEvent) {
    boardName.current = event.target.value
  }

  /**
   * handle updating TodoBoard name on blur
   */
  function handleBlur() {
    setBoardName(boardName.current)
  }

  return (
    <div className={styles.todoItemBoard}>
      <div className={styles.header}>
        <div>
          <h1><ContentEditable html={boardName.current} onChange={handleChange} onBlur={handleBlur} /></h1>
        </div>
        <div className={styles.controls}>
          <ProgressionButton onClick={goBackAWeek} disabled={loading} direction={ProgressButtonDirection.BACKWARD} />
          <ProgressionButton onClick={goForwardAWeek} disabled={loading} direction={ProgressButtonDirection.FORWARD} />
        </div>
      </div>
      <div className={styles.columns}>
          {dayLists}
      </div>
      <div className={styles.columns}>
          {weekLists}
      </div>
      <div className={styles.columns}>
          {monthLists}
      </div>
    </div>
  )
}