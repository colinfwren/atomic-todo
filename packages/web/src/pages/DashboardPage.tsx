import React from 'react'
import {DashboardProvider} from "../contexts/DashboardContext";
import {TodoBoardList} from "../components/TodoBoardList/TodoBoardList";
/**
 * Dashboard Page
 * @constructor
 */
export function DashboardPage() {
  return (
    <DashboardProvider>
      <h1>Dashboard</h1>
      <TodoBoardList />
    </DashboardProvider>
  )
}