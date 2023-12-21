import React, {MouseEventHandler, useRef} from 'react'
import styles from './Modal.module.css'
import {useContext} from "react";
import AppContext from "../../contexts/AppContext";
import {DeleteIcon} from "../icons/DeleteIcon";

/**
 * Modal container
 * @constructor
 */
export function Modal() {
  const { todos, modal: { todoId }, actions: { hideModal, deleteTodo }} = useContext(AppContext)
  const scrimRef = useRef<HTMLDivElement>(null)

  const todo = todos.find((todo) => todo.id === todoId)

  /**
   * Close the modal
   */
  function closeModal(event: React.MouseEvent<HTMLDivElement>) {
    if(event.target === scrimRef.current) {
      hideModal()
    }
  }

  /**
   * Delete the dodo
   */
  function handleDeleteTodo(event: React.MouseEvent<HTMLButtonElement>) {
    if (todo) {
      deleteTodo(todo.id)
    }
  }

  if (todo) {
    return (
      <div className={styles.scrim} onClick={closeModal} ref={scrimRef}>
        <div className={styles.modal}>
          <div className={styles.container}>
            <div className={styles.actionRow}>
              <button onClick={handleDeleteTodo}>
                <DeleteIcon />
            </button>
            </div>
            <div className={styles.detailsRow}>
              <h2>{todo.name}</h2>
            </div>
            <div className={styles.visibilityRow}>
              <h3>Visibility</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}