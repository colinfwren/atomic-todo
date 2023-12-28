import React, {useContext} from 'react'
import {useDroppable} from "@dnd-kit/core";
import styles from './TodoItemList.module.css'
import {TodoItemListProps, TodoListMap} from "../../types";
import AppContext from "../../contexts/AppContext";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableTodoItem} from "../SortableTodoItem/SortableTodoItem";
import {TodoItemListTitle} from "../TodoItemListTitle/TodoItemListTitle";
import {Todo, TodoLevel, TodoPositionInput} from "@atomic-todo/server/dist/src/generated/graphql";
import { getEndDateForList } from "../../functions/getEndDateForList";
import { getHoursToFirstDayOfWeek } from "../../functions/getHoursForFirstDayOfWeek";


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
 * @param {TodoListMap} lists - Map of lists
 * @returns {TodoPositionInput[]} - Array of positions of new Todo in different granularity of list
 */
export function getNewTodoPositions(listStartDate: Date, listEndDate: Date, lists: TodoListMap): TodoPositionInput[] {
  const weekStartDate = getStartDateForGranularity(listStartDate, TodoLevel.Week)
  const weekEndDate = getEndDateForList(weekStartDate, TodoLevel.Week)
  const monthStartDate = getStartDateForGranularity(listStartDate, TodoLevel.Month)
  const monthEndDate = getEndDateForList(monthStartDate, TodoLevel.Month)
  const monthList = [...lists.values()].find((list) => list.listStartDate === monthStartDate && list.listEndDate === monthEndDate)
  const weekList = [...lists.values()].find((list) => list.listStartDate === weekStartDate && list.listEndDate === weekEndDate)
  const dayList = [...lists.values()].find((list) => list.listStartDate === listStartDate && list.listEndDate === listEndDate)


  return [
    {
      granularity: TodoLevel.Month,
      position: monthList?.todos.length || 0
    },
    {
      granularity: TodoLevel.Week,
      position: weekList?.todos.length || 0
    },
    {
      granularity: TodoLevel.Day,
      position: dayList?.todos.length || 0
    }
  ]
}

/**
 * Render a TodoList
 *
 * @param {TodoItemListProps} props - Props passed into the component
 * @param {string} props.id - ID of the TodoList
 * @param {TodoLevel} props.granularity - Granularity of the TodoBoard that the TodoList is rendered under
 * @param {Date} props.listStartDate - The start date for the period the list represents
 * @param {number} props.listPeriodDelta - The delta within the granularity that the list represents
 * @constructor
 */
export function TodoItemList({ id, granularity, listStartDate, listEndDate, listPeriodDelta, era }: TodoItemListProps): JSX.Element | null {
  const { loading, todos, lists, actions: { addTodo } } = useContext(AppContext)

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: 'list',
      listStartDate,
      listEndDate,
      granularity,
      listId: id,
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
      const positions = getNewTodoPositions(listStartDate, listEndDate, lists)
      addTodo(listStartDate, listEndDate, positions)
    }
  }

  const list = lists.get(id)
  if (!list) return null

  const todoItems = list.todos
    .filter((todoId) => todos.has(todoId))
    .map((todoId) => todos.get(todoId)!)
    .sort((todoA, todoB) => {
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
      <TodoItemListTitle listPeriodDelta={listPeriodDelta} era={era} granularity={granularity} listStartDate={listStartDate} />
      <SortableContext items={todoItems.map((todoItem) => todoItem.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={style} className={styles.listContainer}>
          {todoItems.map((todoItem: Todo, index) => <SortableTodoItem id={todoItem.id} key={todoItem.id} granularity={granularity} listStartDate={listStartDate} listEndDate={listEndDate} index={index} listId={id} />)}
        </div>
      </SortableContext>
      <div className={styles.addContainer}>
        <button className={styles.addButton} onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  )
}