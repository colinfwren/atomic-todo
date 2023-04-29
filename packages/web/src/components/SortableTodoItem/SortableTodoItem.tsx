import React from 'react';
import {useSortable} from "@dnd-kit/sortable";
import {TodoItem} from "../TodoItem/TodoItem";
import {SortableTodoItemProps} from "../../types";

/**
 * Sortable wrapper around TodoItem
 *
 * @param {SortableTodoItemProps} props - Props passed to component
 * @returns {JSX.Element} sortable TodoItem
 * @constructor
 */
export function SortableTodoItem({ id, level, listId, index }: SortableTodoItemProps) {

  const itemId = `${level}_${id}`

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
      level,
      listId: listId,
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