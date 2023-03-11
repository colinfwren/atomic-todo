import { useDraggable } from "@dnd-kit/core";
import {Todo, TodoLevel} from 'atomic-todo-server/src/generated/graphql'
import styles from "./TodoItem.module.css"

export interface TodoItemProps extends Todo {
  level: TodoLevel
  listId: string
}

export function TodoItem({ id, name, completed, level, listId }: TodoItemProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${level}_${id}`,
    data: {
      sourceListId: listId,
      todoId: id
    }
  })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px,0)`} : undefined
  return (
    <div className={styles.todoItem} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <input type='checkbox' checked={completed} readOnly />
      <p>{ name }</p>
    </div>
  )
}