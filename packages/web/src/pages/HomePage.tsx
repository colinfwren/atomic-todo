import React, {useContext} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {LoginForm} from "../components/LoginForm/LoginForm";
import {SignUpForm} from "../components/SignUpForm/SignUpForm";
/**
 * Landing page fot the app when the user isn't authenticated
 * @constructor
 */
export function HomePage() {
  const { user, actions: { signOut }} = useContext(AuthContext)

  /**
   * handle pressing sign out button
   */
  async function handleSignOut() {
    await signOut()
  }

  return (
    <div>
      <h1>Homepage</h1>
      <p>{ user?.email }</p>
      {user &&
          <button onClick={handleSignOut}>Sign out</button>
      }
      {!user &&
          <>
            <LoginForm/>
            <SignUpForm />
          </>
      }
    </div>
  )
}