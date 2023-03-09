import { TodoBoard } from 'atomic-todo-server/src/generated/graphql'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'

export interface TodoItemBoardProps extends TodoBoard {}

export function TodoItemBoard({ name, days, weeks, months }: TodoItemBoardProps): JSX.Element {

  const dayLists = days.map((list) => <TodoItemList {...list} key={list.id} />)
  const weekLists = weeks.map((list) => <TodoItemList {...list} key={list.id} />)
  const monthLists = months.map((list) => <TodoItemList {...list} key={list.id} />)

  return (
    <div className={styles.todoItemBoard}>
      <h1>{ name }</h1>
      <div className={styles.days}>
        <h2>Days</h2>
        <div>
          {dayLists}
        </div>
      </div>
      <div className={styles.weeks}>
        <h2>Weeks</h2>
        <div>
          {weekLists}
        </div>
      </div>
      <div className={styles.months}>
        <h2>Months</h2>
        <div>
          {monthLists}
        </div>
      </div>
    </div>
  )
}