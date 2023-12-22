import React, {useContext} from 'react'
import {useDroppable} from "@dnd-kit/core";
import styles from './TodoItemList.module.css'
import {TodoItemListProps} from "../../types";
import AppContext from "../../contexts/AppContext";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableTodoItem} from "../SortableTodoItem/SortableTodoItem";
import {TodoItemListTitle} from "../TodoItemListTitle/TodoItemListTitle";
import {TodoLevel, Todo} from "@atomic-todo/server/dist/src/generated/graphql";

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
      addTodo(listStartDate, listEndDate)
    }
  }

  const todoItems = todos.filter(({ startDate, endDate, showInWeek, showInMonth, name }) => {
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