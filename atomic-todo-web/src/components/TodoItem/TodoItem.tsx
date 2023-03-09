import { Todo } from 'atomic-todo-server/src/generated/graphql'
import styles from "./TodoItem.module.css"

export interface TodoItemProps extends Todo {}

export function TodoItem({ name, completed }: TodoItemProps): JSX.Element {
  return (
    <div className={styles.todoItem}>
      <input type='checkbox' checked={completed} readOnly />
      <p>{ name }</p>
    </div>
  )
}