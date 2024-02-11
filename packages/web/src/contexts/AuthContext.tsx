import React, {createContext, useEffect, useState} from "react";
import { IAuthContext, AuthState, AuthProviderProps } from "../types";
import {createAccount, createSession, endSession, restoreExistingSession} from "../services/appwrite";

const initialState: AuthState = {
  user: null,
  session: null
}

const actions = {
  signIn: async (email: string, password: string) => {},
  signUp: async (email: string, password: string, name: string) => {},
  signOut: async () => {}
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
  const [restoringSession, setRestoringSession] = useState<boolean>(false)

  useEffect(() => {
    /**
     * Get existing session if there is one and set the auth state
     */
    async function restoreSession() {
      const authState = await restoreExistingSession()
      setData(authState)
    }

    if (!restoringSession) {
      restoreSession()
      setRestoringSession(true)
    }
  })

  const value = {
    ...data,
    actions: {
      signIn: async (email: string, password: string) => {
        try {
          const authenticatedUser = await createSession(email, password)
          setData(authenticatedUser)
        } catch {
          setData(initialState)
        }
      },
      signUp: async (email: string, password: string, name: string) => {
        try {
          const authenticatedUser = await createAccount(email, password, name)
          setData(authenticatedUser)
        } catch {
          setData(initialState)
        }
      },
      signOut: async () => {
        if (data.session) {
          await endSession()
          setData({
            user: null,
            session: null
          })
        }
      }
    }
  }
  return <Provider value={value}>{children}</Provider>
}

export default AuthContext