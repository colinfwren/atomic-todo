import React, {createContext, useState} from "react";
import { IAuthContext, AuthState, AuthProviderProps } from "../types";

const initialState: AuthState = {
  user: null
}

const actions = {
  signIn: (user: string) => {},
  signOut: () => {}
}

const AuthContext = createContext<IAuthContext>({ ...initialState, actions })
const { Provider } = AuthContext

/**
 * Provides authentication state data
 *
 * @param {JSX.Element|JSX.Element[]} children - Components that are wrapped in the context
 * @constructor
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>(initialState)
  const value = {
    ...data,
    actions: {
      signIn: (user: string) => {
        setData({ user })
      },
      signOut: () => {
        setData({ user: null })
      }
    }
  }
  return <Provider value={value}>{children}</Provider>
}

export default AuthContext