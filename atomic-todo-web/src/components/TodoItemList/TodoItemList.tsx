import { TodoList } from 'atomic-todo-server/src/generated/graphql'
import {TodoItem} from "../TodoItem/TodoItem";
import styles from './TodoItemList.module.css'

export interface TodoItemListProps extends TodoList {}

export function TodoItemList({ name, todos }: TodoItemListProps): JSX.Element {
  const todoItems = todos.map((todo) => <TodoItem {...todo} key={todo.id} />)
  return (
    <div className={styles.todoItemList}>
      <h3>{ name }</h3>
      <div>
        {todoItems}
      </div>
    </div>
  )
}