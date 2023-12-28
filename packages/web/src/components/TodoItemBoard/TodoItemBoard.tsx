import React, {useContext, useRef} from 'react'
import {TodoItemList as TodoItemListComp} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'
import AppContext from "../../contexts/AppContext";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {ProgressionButton} from "../ProgressionButton/ProgressionButton";
import {ProgressButtonDirection, TodoItemList, TodoItemListProps} from "../../types";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";


const granularity = [TodoLevel.Month, TodoLevel.Week, TodoLevel.Day]

/**
 * Render a board of Todo Lists
 *
 * @constructor
 */
export function TodoItemBoard(): JSX.Element {
  const { board: { name, months, weeks, days }, lists, actions: { moveBoardForward, moveBoardBackward, setBoardName }, loading} = useContext(AppContext)
  const boardName = useRef(name)

  /**
   * Create a TodoList component
   *
   * @param {string} listId - ID of the list to create component for
   * @param {number} index - Index of the list in the array of lists
   */
  function createTodoList(listId: string, index: number): JSX.Element {
    const list = lists.get(listId)
    if (list) {
      const props: TodoItemListProps = {
        ...list,
        listPeriodDelta: index
      }
      return (
        <TodoItemListComp {...props} key={list.id} />
      )
    }
  return <div />
}

  const monthRows = months.map(createTodoList)
  const weekRows = weeks.map(createTodoList)
  const dayRows = days.map(createTodoList).reduce((elements: JSX.Element[], list, index, lists) => {
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

  const boardRows = [dayRows, weekRows, monthRows].map((row, index) => {
    return (
      <div className={styles.columns} key={granularity[index]}>
        {row}
      </div>
    )
  })


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
      {boardRows}
    </div>
  )
}