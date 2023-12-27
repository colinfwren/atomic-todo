import styles from "./TodoItemListTitle.module.css";
import React from "react";
import {TodoItemListTitleProps, TodoListEra} from "../../types";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {getTodoListTitleDate} from "../../functions/getTodoListTitleDate";

const PAST_CLASSES = `${styles.title} ${styles.past}`
const TODAY_CLASSES = `${styles.title} ${styles.today}`

/**
 * Get the classnames for the todo list title
 *
 * @param {TodoListEra} era - The era for the list
 * @returns {string} classnames to use for todo item list title
 */
function getClassNames(era: TodoListEra): string {
  switch (era) {
    case TodoListEra.past:
      return PAST_CLASSES
    case TodoListEra.current:
      return TODAY_CLASSES
    case TodoListEra.future:
      return styles.title
  }
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


/**
 * Create a string that represents the delta at the granularity the list represents
 *
 * @param {Date} listStartDate - The date the list starts on
 * @param {TodoLevel} granularity - The granularity of time the list represents
 * @param {number} delta - The delta from board start the list represents
 */
function getListName(listStartDate: Date, granularity: TodoLevel, delta: number): string {
  switch (granularity) {
    case TodoLevel.Day:
      return dayNames[listStartDate.getDay()]
    case TodoLevel.Week:
      return delta === 0 ? '1 Week' : `${delta + 1} Weeks`
    case TodoLevel.Month:
      return delta === 0 ? '1 Month' : `${delta + 1} Months`
  }
}



/**
 * Render the Todo Item List's title
 *
 * @param {TodoItemListTitleProps} props - Props passed to component
 * @param {Date} props.listStartDate - The start date of the list
 * @param {TodoLevel} props.granularity - The granularity the list represents
 * @param {number} props.listPeriodDelta - The delta from the board's start date applied at the granularity
 * @param {TodoListEra} props.era - The era for the TodoList
 * @constructor
 */
export function TodoItemListTitle({ listStartDate, granularity, era, listPeriodDelta }: TodoItemListTitleProps): JSX.Element {
  const classNames = getClassNames(era)
  const listName = getListName(listStartDate, granularity, listPeriodDelta)
  const listDate = getTodoListTitleDate(listStartDate, granularity)
  return (
    <div className={classNames}>
      <h3>{listName}</h3>
      <h4>{listDate}</h4>
    </div>
  )
}