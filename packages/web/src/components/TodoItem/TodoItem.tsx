import React, {useContext, useEffect, forwardRef, Ref, memo, useRef} from 'react'
import styles from "./TodoItem.module.css"
import { TodoItemProps } from "../../types";
import AppContext from "../../contexts/AppContext";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import {DragHandleIcon} from "../icons/DragHandleIcon";

/**
 * Get the classnames for the Todo Item
 *
 * @param {boolean} isDragging - If the item is currently being dragged
 * @returns {string} classNames to use
 */
function getClassNames(isDragging?: boolean): string {
  if (isDragging) return `${styles.todoItemContainer} ${styles.dragging}`
  return styles.todoItemContainer
}

/**
 * Todo Item
 * @param id
 * @param index
 * @param handleProps
 * @param listeners
 * @param transform
 * @param transition
 * @param dragOverlay
 * @param ref
 * @constructor
 */
function Todo({ id, index, handleProps, listeners, transform, transition, dragOverlay, dragging }: TodoItemProps, ref: Ref<HTMLDivElement>): JSX.Element | null {

  useEffect(() => {
    if (!dragOverlay) {
      return;
    }

    document.body.style.cursor = 'grabbing'

    return () => {
      document.body.style.cursor = ''
    }
  }, [dragOverlay])

  const { todos, actions } = useContext(AppContext)
  const value = useRef('')
  const todo = todos.find((todo) => todo.id === id)

  /**
   * Callback for when checkbox is clicked
   */
  function onClickCheckbox() {
    if (todo) {
      actions.setTodoCompleted(todo, !todo.completed)
    }
  }

  /**
   * Callback for when content is edited
   */
  function handleContentChange(event: ContentEditableEvent) {
    if (todo) {
      value.current = event.target.value
    }
   }

  /**
   * Callback for when focus is removed from the editing (i.e. save on finish)
   */
  function handleBlur() {
    if (todo) {
      actions.setTodoName(todo, value.current)
    }
  }

  /**
   * Callback for when menu is clicked instead of dragged
   */
  function openModal() {
    if (todo) {
      actions.showModal(todo.id)
    }
  }

  const style = {
    transition: [transition]
      .filter(Boolean)
      .join(', '),
    '--translate-x': transform
      ? `${Math.round(transform.x)}px`
      : undefined,
    '--translate-y': transform
      ? `${Math.round(transform.y)}px`
      : undefined,
    '--scale-x': transform?.scaleX
      ? `${transform.scaleX}`
      : undefined,
    '--scale-y': transform?.scaleY
      ? `${transform.scaleY}`
      : undefined,
    '--index': index,
  }

  if (todo) {
    value.current = todo.name
    const classNames = getClassNames(dragging)
    return (
      <div ref={ref} className={classNames} style={style}>
        <div className={styles.todoItem}>
          <div className={styles.menuContainer} {...listeners} {...handleProps} onClick={openModal}>
            <div className={styles.menu}>
              <DragHandleIcon />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <input type='checkbox' checked={todo.completed} onChange={onClickCheckbox}/>
            <span className={styles.checkmark} onClick={onClickCheckbox}></span>
          </div>
          <div className={styles.textContainer}>
            <ContentEditable html={value.current} onBlur={handleBlur} onChange={handleContentChange} />
          </div>
        </div>
      </div>
    )
  }
  return null
}

export const TodoItem = memo(forwardRef<HTMLDivElement, TodoItemProps>(Todo))