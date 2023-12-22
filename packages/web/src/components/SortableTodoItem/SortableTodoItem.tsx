import React from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {TodoItem} from "../TodoItem/TodoItem";
import {SortableTodoItemProps} from "../../types";

/**
 * Sortable wrapper around TodoItem
 *
 * @param {SortableTodoItemProps} props - Props passed to component
 * @param {string} props.id - The ID of the todo
 * @param {TodoLevel} props.granularity - The granularity of the list the todo item is in
 * @param {Date} props.listStartDate - The start date of the list the todo item is in
 * @param {Date} props.listEndDate - The end date of the list the todo item is in
 * @param {number} props.index - The index of the todo item in the list it is in
 * @returns {JSX.Element} sortable TodoItem
 * @constructor
 */
export function SortableTodoItem({ id, granularity, listStartDate, listEndDate, index }: SortableTodoItemProps) {

  const itemId = `${granularity}_${id}`

  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition
  } = useSortable({
    id: itemId,
    data: {
      type: 'todo',
      granularity,
      listStartDate,
      listEndDate,
      todoId: id,
    }
  })

  return (
    <TodoItem
      ref={setNodeRef}
      handleProps={{ ref: setActivatorNodeRef }}
      id={id}
      dragging={isDragging}
      sorting={isSorting}
      transition={transition}
      transform={transform}
      listeners={listeners}
      index={index}
    />
  )
}