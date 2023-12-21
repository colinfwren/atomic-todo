import styles from "./TodoItemListTitle.module.css";
import React from "react";
import {TodoItemListTitleProps} from "../../types";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import { getTodoListTitleDate } from "../../functions/getTodoListTitleDate";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const PAST_CLASSES = `${styles.title} ${styles.past}`
const TODAY_CLASSES = `${styles.title} ${styles.today}`

/**
 * Get the classnames for the todo list title
 *
 * @param {Date} listStartDate - The start date for the period the list represents
 * @param {Date} currentDate - Current date
 * @param {TodoLevel} granularity - The granularity the list represents
 * @returns {string} classnames to use for todo item list title
 */
function getClassNames(listStartDate: Date, currentDate: Date, granularity: TodoLevel): string {
  const dateDelta = Math.round((listStartDate.getTime() - currentDate.getTime()) / MS_PER_DAY)
  if (granularity === TodoLevel.Day) {
    if (dateDelta < 0) {
      return PAST_CLASSES
    } else if (dateDelta === 0) {
      return TODAY_CLASSES
    }
  } else if (granularity === TodoLevel.Week) {
    if (dateDelta < -6) {
      return PAST_CLASSES
    }
  } else {
    const monthDate = new Date(currentDate)
    monthDate.setDate(1)
    if ((listStartDate.getTime() - monthDate.getTime()) < 0) {
      return PAST_CLASSES
    }
  }
  return styles.title
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
 * @param {Date} props.currentDate - The current date
 * @constructor
 */
export function TodoItemListTitle({ listStartDate, granularity, currentDate, listPeriodDelta }: TodoItemListTitleProps): JSX.Element {
  const classNames = getClassNames(listStartDate, currentDate, granularity)
  const listName = getListName(listStartDate, granularity, listPeriodDelta)
  const listDate = getTodoListTitleDate(listStartDate, granularity)
  return (
    <div className={classNames}>
      <h3>{listName}</h3>
      <h4>{listDate}</h4>
    </div>
  )
}