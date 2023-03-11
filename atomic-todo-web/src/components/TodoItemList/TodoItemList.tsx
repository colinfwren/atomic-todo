import { useDroppable } from "@dnd-kit/core";
import {Todo, TodoList} from 'atomic-todo-server/src/generated/graphql'
import {TodoItem} from "../TodoItem/TodoItem";
import styles from './TodoItemList.module.css'

export interface TodoItemListProps extends TodoList {
  todosMap: Map<string, Todo>
}

export function TodoItemList({ id, name, todos, level, todosMap }: TodoItemListProps): JSX.Element {
  const { isOver, setNodeRef } = useDroppable({
    id: `${level}_${id}`,
    data: {
      listId: id
    }
  })
  const style = isOver ? {
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(0,0,0,0.8)',
  } : undefined
  const todoItems = todos.map((todoId) => {
    const todo = todosMap.get(todoId)
    return todo ? <TodoItem {...todo} key={todo.id} level={level} listId={id} /> : null
  })
  return (
    <div className={styles.todoItemList}>
      <h3>{ name }</h3>
      <div ref={setNodeRef} style={style} className={styles.listContainer}>
        {todoItems}
      </div>
    </div>
  )
}