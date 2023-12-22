import React, {useContext, useRef} from 'react'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'
import AppContext from "../../contexts/AppContext";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {ProgressionButton} from "../ProgressionButton/ProgressionButton";
import {ProgressButtonDirection} from "../../types";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";

const DAY_DELTAS = [0, 1, 2, 3, 4, 5, 6]
const WEEK_MONTH_DELTAS = [0, 1, 2, 3, 4, 5]

const rows = [
  { granularity: TodoLevel.Day, deltas: DAY_DELTAS },
  { granularity: TodoLevel.Week, deltas: WEEK_MONTH_DELTAS },
  { granularity: TodoLevel.Month, deltas: WEEK_MONTH_DELTAS }
]

/**
 * Get the number of hours to subtract from the current date to get to the first day of the week
 *
 * @param {Date} date - The date for the week
 */
export function getHoursToFirstDayOfWeek(date: Date): number {
  const day = date.getDay() || 7
  if (day !== 1) {
    return -24 * (day - 1)
  }
  return 0
}

/**
 * Calculate the start date for the list based on the granularity and the delta to be applied
 *
 * @param {Date} boardStartDate - The start date for the board
 * @param {TodoLevel} granularity - The granularity the list represents
 * @param {number} delta - The relative date delta to apply based on the granularity
 */
export function getStartDateForList(boardStartDate: Date, granularity: TodoLevel, delta: number): Date {
  const listStartDate = new Date(boardStartDate)
  listStartDate.setHours(getHoursToFirstDayOfWeek(listStartDate))
  switch (granularity) {
    case TodoLevel.Day:
      listStartDate.setDate(listStartDate.getDate() + delta)
      break;
    case TodoLevel.Week:
      listStartDate.setDate(listStartDate.getDate() + (delta * 7))
      break;
    case TodoLevel.Month:
      listStartDate.setDate(1)
      listStartDate.setMonth(listStartDate.getMonth() + delta)
      break;
  }
  return listStartDate
}

/**
 * Render a board of Todo Lists
 *
 * @constructor
 */
export function TodoItemBoard(): JSX.Element {
  const { board: { name, startDate }, actions: { moveBoardForward, moveBoardBackward, setBoardName }, loading} = useContext(AppContext)
  const boardName = useRef(name)
  const rawDate = new Date()
  const currentDate = new Date(rawDate.toISOString())
  currentDate.setHours(0, 0, 0, 0)
  const boardStartDate = new Date(startDate)

  const boardRows = rows.map(({ granularity, deltas }) => {
    const row = deltas.map((delta) => {
      const listStartDate = getStartDateForList(boardStartDate, granularity, delta)
      return (
        <TodoItemList
          id={`${granularity}-${delta}`}
          key={`${granularity}-${delta}`}
          granularity={granularity}
          currentDate={currentDate}
          listStartDate={listStartDate}
          listPeriodDelta={delta}
        />
      )
    })
    if (granularity === TodoLevel.Day) {
      const reducedColumns = row.reduce((elements: JSX.Element[], list, index, lists) => {
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
      return (
        <div className={styles.columns} key={granularity}>
          {reducedColumns}
        </div>
      )
    }
    return (
      <div className={styles.columns} key={granularity}>
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