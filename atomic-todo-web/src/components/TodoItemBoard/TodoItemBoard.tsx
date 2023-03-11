import {TodoBoard, Todo, TodoList} from 'atomic-todo-server/src/generated/graphql'
import {TodoItemList} from "../TodoItemList/TodoItemList";
import styles from './TodoItemBoard.module.css'

export interface TodoItemBoardProps extends TodoBoard {
  todos: Map<string, Todo>,
  lists: Map<string, TodoList>
}

export function TodoItemBoard({ name, days, weeks, months, lists, todos }: TodoItemBoardProps): JSX.Element {

  const dayLists = days.map((listId) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })
  const weekLists = weeks.map((listId) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })
  const monthLists = months.map((listId) => {
    const list = lists.get(listId)
    return list ? <TodoItemList {...list} key={listId} todosMap={todos} /> : null
  })

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