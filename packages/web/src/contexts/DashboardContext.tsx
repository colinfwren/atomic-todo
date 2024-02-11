import React, {createContext} from 'react'
import {DashboardProviderProps, DashboardState, IDashboardContext} from "../types";
import { useQuery} from "@apollo/client";
import {GET_TODOBOARDS_QUERY} from "../constants";

const initialState: DashboardState = {
  boards: []
}

const DashboardContext = createContext<IDashboardContext>({ ...initialState, loading: false, error: null })
const { Provider } = DashboardContext

/**
 * Provider for the TodoBoardContext
 *
 * @param {TodoBoardProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 */
export function DashboardProvider({ children }: DashboardProviderProps) {
  const { loading, error, data } = useQuery(GET_TODOBOARDS_QUERY)

  const value = {
    boards: data?.getTodoBoards,
    loading,
    error: error ? error.message : null,
  }

  return <Provider value={value}>{children}</Provider>
}

export default DashboardContext