import React, {SyntheticEvent, useContext} from "react";
import { FormInput } from "../FormInput/FormInput";
import { SignUpFormElement } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";

/**
 * Login form
 * @constructor
 */
export function SignUpForm() {
  const { actions: { signUp }} = useContext(AuthContext)
  const navigate = useNavigate()

  /**
   * Handle submitting the login form
   * @param event
   */
  async function handleSubmit(event: SyntheticEvent<SignUpFormElement>) {
    event.preventDefault()
    const emailAddress = event.currentTarget.elements.emailAddressInput.value
    const password = event.currentTarget.elements.passwordInput.value
    const name = event.currentTarget.elements.nameInput.value
    await signUp(emailAddress, password, name)
    navigate('/dashboard')
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form method='post' onSubmit={handleSubmit}>
        <FormInput
          fieldId='nameInput'
          label='Name'
          inputType='text'
          isInvalid={false}
          invalidMessage=''
        />
        <FormInput
          fieldId='emailAddressInput'
          label='Email address'
          inputType='email'
          isInvalid={false}
          invalidMessage=''
        />
        <FormInput
          fieldId='passwordInput'
          label='Password'
          inputType='password'
          isInvalid={false}
          invalidMessage=''
        />
        <div aria-live="assertive" id='screenreader-message'></div>
        <button type='submit'>Log in</button>
      </form>
    </div>
  )
}