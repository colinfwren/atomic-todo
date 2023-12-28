import { Client, Account, ID} from 'appwrite'
import {AuthState} from "../types";

const client = new Client()
client
  .setEndpoint('http://localhost/v1')
  .setProject('atomic-todo')

const account = new Account(client)

/**
 * Create account for user using supplied email address and password
 *
 * @param {string} emailAddress - Email address to set for account
 * @param {string} password - Password to set for account
 * @returns {Promise<AuthState>} The created user and the session after logging the user in
 */
export async function createAccount(emailAddress: string, password: string): Promise<AuthState> {
  const createdAccount = await account.create(ID.unique(), emailAddress, password)
  const session = await account.createEmailSession(emailAddress, password)
  return {
    user: createdAccount,
    session
  }
}

/**
 * Create a session for a user using supplied email address and password
 *
 * @param {string} emailAddress - Email address for account
 * @param {string} password - Password for account
 * @returns {Promise<AuthState>} The create session and the user object
 */
export async function createSession(emailAddress: string, password: string): Promise<AuthState> {
  const session = await account.createEmailSession(emailAddress, password)
  const user = await account.get()
  return {
    user,
    session
  }
}

/**
 * End the user's current session
 */
export async function endSession() {
  await account.deleteSession('current')
}

/**
 * Return existing session for user if there is one
 */
export async function restoreExistingSession(): Promise<AuthState> {
  try {
    const user = await account.get()
    const session = await account.getSession('current')
    return {
      user,
      session
    }
  } catch (error) {
    return {
      user: null,
      session: null
    }
  }
}