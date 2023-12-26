import React, {useContext} from 'react'
import {useDroppable} from "@dnd-kit/core";
import styles from './TodoItemList.module.css'
import {TodoItemListProps} from "../../types";
import AppContext from "../../contexts/AppContext";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableTodoItem} from "../SortableTodoItem/SortableTodoItem";
import {TodoItemListTitle} from "../TodoItemListTitle/TodoItemListTitle";
import {Todo, TodoLevel, TodoPositionInput} from "@atomic-todo/server/dist/src/generated/graphql";
import {getHoursToFirstDayOfWeek} from "../TodoItemBoard/TodoItemBoard";

/**
 * Calculate the end date for the list based on the granularity
 *
 * @param {Date} listStartDate - The start date for the list
 * @param {TodoLevel} granularity - The granularity the list represents
 */
export function getEndDateForList(listStartDate: Date, granularity: TodoLevel): Date {
  const listEndDate = new Date(listStartDate)
  switch (granularity) {
    case TodoLevel.Day:
      listEndDate.setDate(listEndDate.getDate() + 1)
      break;
    case TodoLevel.Week:
      listEndDate.setDate(listEndDate.getDate() + 7)
      break;
    case TodoLevel.Month:
      listEndDate.setMonth(listEndDate.getMonth() + 1)
      break;
  }
  return listEndDate
}

/**
 * Calculate the start date fot the list based on the specified granularity
 *
 * @param {Date} listStartDate - The start date for the list
 * @param {TodoLevel} granularity - The granularity the list represents
 */
export function getStartDateForGranularity(listStartDate: Date, granularity: TodoLevel): Date {
  const startDate = new Date(listStartDate)
  startDate.setHours(0, 0, 0, 0)
  switch (granularity) {
    case TodoLevel.Week:
      startDate.setHours(getHoursToFirstDayOfWeek(listStartDate))
      break;
    case TodoLevel.Month:
      startDate.setDate(1)
      break;
  }
  return startDate
}

/**
 * Get the Todos to display for the specified granularity
 *
 * @param {Date} listStartDate - The start date of the list
 * @param {Date} listEndDate - The end date of the list
 * @param {TodoLevel} granularity - The granularity to get the Todos for
 * @param {Todo[]} todos - The list of Todos to filter
 */
export function getTodosForGranularity(listStartDate: Date, listEndDate: Date, granularity: TodoLevel, todos: Todo[]): Todo[] {
  return todos.filter(({ startDate, endDate, showInWeek, showInMonth, name }) => {
    const todoStartDate = new Date(startDate * 1000)
    const todoEndDate = new Date(endDate * 1000)
    switch(granularity) {
      case TodoLevel.Day:
        return todoStartDate >= listStartDate && todoEndDate <= listEndDate
      case TodoLevel.Week:
        return showInWeek && todoStartDate >= listStartDate && todoEndDate <= listEndDate
      case TodoLevel.Month:
        return showInMonth && todoStartDate >= listStartDate && todoEndDate <= listEndDate
    }
  })
}

/**
 * Get the array of positions for the new Todo in the different granularity it'll show up in
 *
 * @param {Date} listStartDate - The start date of the list
 * @param {Date} listEndDate - The end date of the list
 * @param {TodoLevel} granularity - The granularity to get the count of Todos for
 * @param {Todo[]} todos - The list of Todos
 */
export function getNewTodoPositions(listStartDate: Date, listEndDate: Date, granularity: TodoLevel, todos: Todo[]): TodoPositionInput[] {
  const weekStartDate = getStartDateForGranularity(listStartDate, TodoLevel.Week)
  const weekEndDate = getEndDateForList(weekStartDate, TodoLevel.Week)
  const monthStartDate = getStartDateForGranularity(listStartDate, TodoLevel.Month)
  const monthEndDate = getEndDateForList(monthStartDate, TodoLevel.Month)
  switch (granularity) {
    case TodoLevel.Month:
      return [
        {
          granularity: TodoLevel.Month,
          position: getTodosForGranularity(listStartDate, listEndDate, TodoLevel.Month, todos).length
        },
        {
          granularity: TodoLevel.Week,
          position: 0,
        },
        {
          granularity: TodoLevel.Day,
          position: 0
        }
      ]
    case TodoLevel.Week:
      return [
        {
          granularity: TodoLevel.Month,
          position: getTodosForGranularity(monthStartDate, monthEndDate, TodoLevel.Month, todos).length
        },
        {
          granularity: TodoLevel.Week,
          position: getTodosForGranularity(listStartDate, listEndDate, TodoLevel.Week, todos).length
        },
        {
          granularity: TodoLevel.Day,
          position: 0
        }
      ]
    case TodoLevel.Day:
      return [
        {
          granularity: TodoLevel.Month,
          position: getTodosForGranularity(monthStartDate, monthEndDate, TodoLevel.Week, todos).length
        },
        {
          granularity: TodoLevel.Week,
          position: getTodosForGranularity(weekStartDate, weekEndDate, TodoLevel.Week, todos).length
        },
        {
          granularity: TodoLevel.Day,
          position: getTodosForGranularity(listStartDate, listEndDate, TodoLevel.Day, todos).length
        }
      ]
  }
}

/**
 * Render a TodoList
 *
 * @param {TodoItemListProps} props - Props passed into the component
 * @param {string} props.id - ID of the TodoList
 * @param {TodoLevel} props.granularity - Granularity of the TodoBoard that the TodoList is rendered under
 * @param {Date} props.listStartDate - The start date for the period the list represents
 * @param {Date} props.currentDate - The current date
 * @param {number} props.listPeriodDelta - The delta within the granularity that the list represents
 * @constructor
 */
export function TodoItemList({ id, granularity, currentDate, listStartDate, listPeriodDelta }: TodoItemListProps): JSX.Element | null {
  const { loading, todos, actions: { addTodo } } = useContext(AppContext)
  const listEndDate = getEndDateForList(listStartDate, granularity)

  const { isOver, setNodeRef } = useDroppable({
    id: `${granularity}_${id}`,
    data: {
      type: 'list',
      listStartDate,
      listEndDate,
      granularity
    }
  })

  const style = isOver ? {
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(0,0,0,0.8)',
  } : undefined

  /**
   * Add Todo to list when add button clicked
   */
  function handleAddTodo() {
    if (!loading) {
      const positions = getNewTodoPositions(listStartDate, listEndDate, granularity, todos)
      addTodo(listStartDate, listEndDate, positions)
    }
  }

  const todoItems = getTodosForGranularity(listStartDate, listEndDate, granularity, todos).sort((todoA, todoB) => {
    switch (granularity) {
      case TodoLevel.Month:
        return todoA.posInMonth - todoB.posInMonth
      case TodoLevel.Week:
        return todoA.posInWeek - todoB.posInWeek
      case TodoLevel.Day:
        return todoA.posInDay - todoB.posInDay
    }
  })

  return (
    <div className={styles.todoItemList}>
      <TodoItemListTitle listPeriodDelta={listPeriodDelta} currentDate={currentDate} granularity={granularity} listStartDate={listStartDate} />
      <SortableContext items={todoItems.map((todoItem) => todoItem.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={style} className={styles.listContainer}>
          {todoItems.map((todoItem: Todo, index) => <SortableTodoItem id={todoItem.id} key={todoItem.id} granularity={granularity} listStartDate={listStartDate} listEndDate={listEndDate} index={index} />)}
        </div>
      </SortableContext>
      <div className={styles.addContainer}>
        <button className={styles.addButton} onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  )
}