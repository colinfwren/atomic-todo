import styles from "./TodoItemListTitle.module.css";
import React from "react";
import {FormattedTodoList, TodoItemListTitleProps} from "../../types";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const PAST_CLASSES = `${styles.title} ${styles.past}`
const TODAY_CLASSES = `${styles.title} ${styles.today}`

/**
 * Get the classnames for the todo list title
 *
 * @param {FormattedTodoList} list - TodoItemList data
 * @param {Date} currentDate - Current date
 * @returns {string} classnames to use for todo item list title
 */
function getClassNames(list: FormattedTodoList, currentDate: Date): string {
  const listDate = new Date(list.startDate)
  listDate.setHours(0, 0, 0, 0)
  const dateDelta = Math.round((listDate.getTime() - currentDate.getTime()) / MS_PER_DAY)
  if (list.level === TodoLevel.Day) {
    if (dateDelta < 0) {
      return PAST_CLASSES
    } else if (dateDelta === 0) {
      return TODAY_CLASSES
    }
  } else if (list.level === TodoLevel.Week) {
    if (dateDelta < -6) {
      return PAST_CLASSES
    }
  } else {
    const monthDate = new Date(currentDate)
    monthDate.setDate(1)
    if ((listDate.getTime() - monthDate.getTime()) < 0) {
      return PAST_CLASSES
    }
  }
  return styles.title
}

/**
 * Render the Todo Item List's title
 *
 * @param {FormattedTodoList} list - The Todo Item List to render the title for
 * @param {Date} currentDate - The current date
 * @constructor
 */
export function TodoItemListTitle({ list, currentDate }: TodoItemListTitleProps): JSX.Element {
  const classNames = getClassNames(list, currentDate)
  return (
    <div className={classNames}>
      <h3>{list.name}</h3>
      <h4>{list.date}</h4>
    </div>
  )
}