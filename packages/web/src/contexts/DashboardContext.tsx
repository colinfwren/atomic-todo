import React, {createContext, useState} from 'react'
import {DashboardProviderProps, DashboardState, IDashboardContext} from "../types";
// @ts-ignore
import {
  BoardNameUpdateInput,
  Todo,
  TodoLevel,
  TodoPositionInput
} from "@atomic-todo/server/dist/src/generated/graphql";
import {gql, useMutation, useQuery} from "@apollo/client";

const initialState: DashboardState = {
  boards: []
}

const actions = {}

const DashboardContext = createContext<IDashboardContext>({ ...initialState, loading: false })
const { Provider } = DashboardContext

const GET_TODOBOARDS = gql`
  query getTodoBoards {
    getTodoBoards {
      id
      name
    }
  }
`;

/**
 * Provider for the TodoBoardContext
 *
 * @param {TodoBoardProviderProps} props - Props passed into context
 * @param {JSX.Element|JSX.Element[]} props.children - Child elements
 */
export function DashboardProvider({ children }: DashboardProviderProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [data, setData] = useState<DashboardState>(initialState)

  useQuery(GET_TODOBOARDS, {
    onCompleted: (data) => {
      setData({ boards: data.getTodoBoards })
      setLoading(false)
    },
    onError: (error) => {
      setError(error.message)
      setLoading(false)
    }
  })

  const state = {
    ...data,
    loading,
    error,
  }

  const value = {
    ...state,
  }

  return <Provider value={value}>{children}</Provider>
}

export default DashboardContext