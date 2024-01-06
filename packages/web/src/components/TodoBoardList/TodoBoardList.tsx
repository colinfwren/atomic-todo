import React, {useContext} from "react";
import DashboardContext from "../../contexts/DashboardContext";
import {NavLink} from "react-router-dom";
import styles from './TodoBoardList.module.css'

/**
 * List of TodoBoards
 * @constructor
 */
export function TodoBoardList() {
  const { boards} = useContext(DashboardContext)
  const boardListItems = boards.map((board) => {
    return (
      <li key={board.id}>
        <NavLink to={`/todoboard/${board.id}`}>${board.name}</NavLink>
      </li>
    )
  })
  return (
    <ul className={styles.todoBoardList}>
      {boardListItems}
    </ul>
  )
}