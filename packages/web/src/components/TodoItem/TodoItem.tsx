import React, {useContext} from 'react'
import { useDraggable } from "@dnd-kit/core";
import styles from "./TodoItem.module.css"
import { TodoItemProps } from "../../types";
import AppContext from "../../contexts/AppContext";

/**
 * Render a Todo
 *
 * @param {TodoItemProps} props - Properties passed into the component
 * @param {string} props.id - ID of the Todo
 * @param {string} props.level - The level of the TodoList the Todo is rendered in
 * @param {string} props.listId - The ID of the TodoList the Todo is rendered in
 * @constructor
 */
export function TodoItem({ id, level, listId }: TodoItemProps): JSX.Element | null {

  const { todos, actions } = useContext(AppContext)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${level}_${id}`,
    data: {
      sourceListId: listId,
      todoId: id
    }
  })

  const todo = todos.get(id)

  /**
   * Callback for when checkbox is clicked
   */
  function onClickCheckbox() {
    if (todo) {
      actions.setTodoCompleted(todo.id, !todo.completed)
    }
  }

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px,0)`} : undefined

  if (todo) {
    return (
      <div className={styles.todoItem} style={style}>
        <div className={styles.menuContainer} ref={setNodeRef} {...listeners} {...attributes}>
          <div className={styles.menu}>
            <svg viewBox="0 0 10 10">
              <path
                d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"
              >

              </path>
            </svg>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <input type='checkbox' checked={todo.completed} onClick={onClickCheckbox}/>
        </div>
        <div className={styles.textContainer}>
          <p>{todo.name}</p>
        </div>
      </div>
    )
  }
  return null
}