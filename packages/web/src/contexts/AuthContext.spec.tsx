import {render, waitFor} from '@testing-library/react'
import {useContext} from "react";
import AuthContext, {AuthProvider} from "./AuthContext";
import {createAccount, createSession, endSession, restoreExistingSession} from "../services/appwrite";
import {testEmailSession, testUserAccount} from "../testData";
import {act} from "react-dom/test-utils";

const USER_TEST_ID = 'user'
const SESSION_TEST_ID = 'session'
const CREATE_SESSION_TEST_ID = 'createSession'
const CREATE_ACCOUNT_TEST_ID = 'createAccount'
const END_SESSION_TEST_ID = 'endSession'
const CREATE_SESSION_ERROR = 'failed to create session'
const CREATE_ACCOUNT_ERROR = 'failed to create account'

jest.mock('../services/appwrite')

function AuthContextValues() {
  const { user, session, actions } = useContext(AuthContext)
  return (
    <>
      <p data-testid={USER_TEST_ID}>{JSON.stringify(user)}</p>
      <p data-testid={SESSION_TEST_ID}>{JSON.stringify(session)}</p>
      <button data-testid={CREATE_SESSION_TEST_ID} onClick={() => actions.signIn('', '')}>Create Session</button>
      <button data-testid={CREATE_ACCOUNT_TEST_ID} onClick={() => actions.signUp('', '', '')}>Create Account</button>
      <button data-testid={END_SESSION_TEST_ID} onClick={() => actions.signOut()}>End Session</button>
    </>
  )
}

function authTest() {
  return render(
    <AuthProvider>
      <AuthContextValues />
    </AuthProvider>
  )
}

describe('AuthContext', () => {

  describe('restoring previous session', () => {
    it('provides null values for user and session to consumers when no session could be restored', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }))
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
    })

    it('provides user and session information to consumers once existing session is restored', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: testUserAccount,
        session: testEmailSession
      }))
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent(JSON.stringify(testUserAccount))
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent(JSON.stringify(testEmailSession))
    })
  })

  describe('creating session for user', () => {
    it('sets session and user to null when fail to create session for user', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }));
      (createSession as jest.Mock).mockImplementation(() => {
        throw new Error(CREATE_SESSION_ERROR)
      })
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
      act( () => getByTestId(CREATE_SESSION_TEST_ID).click())
      await waitFor(() => expect((createSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
    })

    it('creates session for user and provides user and session information to consumers', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }));
      (createSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: testUserAccount,
        session: testEmailSession
      }))
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
      act(() => getByTestId(CREATE_SESSION_TEST_ID).click())
      await waitFor(() => expect((createSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent(JSON.stringify(testUserAccount))
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent(JSON.stringify(testEmailSession))
    })
  })
  describe('creating an account for user', () => {
    it('sets session and user to null when fail to create account for user', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }));
      (createAccount as jest.Mock).mockImplementation(() => {
        throw new Error(CREATE_ACCOUNT_ERROR)
      })
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
      act( () => getByTestId(CREATE_ACCOUNT_TEST_ID).click())
      await waitFor(() => expect((createAccount as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
    })
    it('sets session and user to newly created user and session when create account for user', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }));
      (createAccount as jest.Mock).mockImplementation(() => Promise.resolve({
        user: testUserAccount,
        session: testEmailSession
      }))
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
      act( () => getByTestId(CREATE_ACCOUNT_TEST_ID).click())
      await waitFor(() => expect((createAccount as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent(JSON.stringify(testUserAccount))
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent(JSON.stringify(testEmailSession))
    })
  })
  describe('ending user session', () => {
    it('takes no action if there is no active session', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: null,
        session: null
      }));
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
      act( () => getByTestId(END_SESSION_TEST_ID).click())
      expect((endSession as jest.Mock)).not.toHaveBeenCalled()
    })

    it('ends the active session if there is one', async () => {
      (restoreExistingSession as jest.Mock).mockImplementation(() => Promise.resolve({
        user: testUserAccount,
        session: testEmailSession
      }));
      const { getByTestId } = authTest()
      await waitFor(() => expect((restoreExistingSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent(JSON.stringify(testUserAccount))
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent(JSON.stringify(testEmailSession))
      act( () => getByTestId(END_SESSION_TEST_ID).click())
      await waitFor(() => expect((endSession as jest.Mock)).toHaveBeenCalled())
      expect(getByTestId(USER_TEST_ID)).toHaveTextContent('null')
      expect(getByTestId(SESSION_TEST_ID)).toHaveTextContent('null')
    })
  })
})