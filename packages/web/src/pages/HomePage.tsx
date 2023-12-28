import React, {useContext} from 'react'
import AuthContext from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
/**
 * Landing page fot the app when the user isn't authenticated
 * @constructor
 */
export function HomePage() {
  const { user, actions: { signUp, signIn, signOut }} = useContext(AuthContext)
  const navigate = useNavigate()

  /**
   * Handle pressing sign up button
   */
  async function handleSignUp() {
    await signUp('test@test.com', 'shitPassword')
    navigate('/dashboard')
  }

  /**
   * Handle pressing sign in button
   */
  async function handleSignIn() {
    await signIn('test@test.com', 'shitPassword')
    navigate('/dashboard')
  }

  /**
   * handle pressing sign out button
   */
  function handleSignOut() {
    signOut()
  }

  return (
    <div>
      <h1>Homepage</h1>
      <p>{ user?.email }</p>
      <button onClick={handleSignUp}>Sign up</button>
      <button onClick={handleSignIn}>Sign in</button>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  )
}