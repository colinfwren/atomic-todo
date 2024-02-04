import {createAccount, createSession, setApiToken, endSession, restoreExistingSession} from "./appwrite";
import { Account} from 'appwrite'
import Mock = jest.Mock;
import {API_TOKEN_LOCAL_STORAGE_KEY} from "../constants";
import {testEmailSession, testUserAccount} from "../testData";

const CREATE_JWT_ERROR_MESSAGE = 'Failed to create JWT'
const LOCAL_STORAGE_ERROR_MESSAGE = 'Local storage failure'
const CREATE_ACCOUNT_ERROR_MESSAGE = 'Failed to create account'
const CREATE_EMAIL_SESSION_ERROR_MESSAGE = 'Failed to create session for email'
const GET_USER_ERROR_MESSAGE = 'Failed to get account for user'
const DELETE_SESSION_ERROR_MESSAGE = 'Failed to delete session'
const GET_SESSION_ERROR_MESSAGE = 'Failed to get session'
const API_TOKEN = {
  jwt: 'thisIsATotallyLegitJwt'
}

describe('appwrite service', () => {
  describe('setting API token', () => {
    it('throws an exception if unable to create JWT for session', async () => {
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          throw new Error(CREATE_JWT_ERROR_MESSAGE)
        })
      await expect(() => setApiToken()).rejects.toThrowError(CREATE_JWT_ERROR_MESSAGE)
    })
    it('throws an exception if unable to set the JWT in local storage', async () => {
       jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          return Promise.resolve(API_TOKEN)
        });
        (window.localStorage.setItem as Mock).mockImplementation(() => {
        throw new Error(LOCAL_STORAGE_ERROR_MESSAGE)
      })
      await expect(() => setApiToken()).rejects.toThrowError(LOCAL_STORAGE_ERROR_MESSAGE)
    })
    it('generates and stores the JWT for the session in local storage', async () => {
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          return Promise.resolve(API_TOKEN)
        });
      await setApiToken()
      expect(window.localStorage.setItem as Mock).toHaveBeenCalledWith(API_TOKEN_LOCAL_STORAGE_KEY, API_TOKEN.jwt)
    })
  })

  describe('creating an account and session for a unregistered user', () => {
    it('throws an exception if unable to create account for user', async () => {
      jest.spyOn(Account.prototype, 'create')
        .mockImplementation(() => {
          throw new Error(CREATE_ACCOUNT_ERROR_MESSAGE)
        })
      await expect(() => createAccount('', '', '')).rejects.toThrowError(CREATE_ACCOUNT_ERROR_MESSAGE)
    })
    it('throws an exception if unable to create session for created user', async () => {
      jest.spyOn(Account.prototype, 'create')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          throw new Error(CREATE_EMAIL_SESSION_ERROR_MESSAGE)
        })
      await expect(() => createAccount('', '', '')).rejects.toThrowError(CREATE_EMAIL_SESSION_ERROR_MESSAGE)
    })
    it('throws an exception if unable to store the JWT for the created session', async () => {
      jest.spyOn(Account.prototype, 'create')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          throw new Error(CREATE_JWT_ERROR_MESSAGE)
        })
      await expect(() => createAccount('', '', '')).rejects.toThrowError(CREATE_JWT_ERROR_MESSAGE)
    })
    it('returns the user and the session after successfully creating an account and session', async () => {
      jest.spyOn(Account.prototype, 'create')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          return Promise.resolve(API_TOKEN)
        });
      const userAndSession = await createAccount('', '', '')
      expect(userAndSession).toMatchObject({
        user: testUserAccount,
        session: testEmailSession
      })
    })
  })

  describe('creating a session for a registered user', () => {
    it('throws an exception if unable to create a session for user', async () => {
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          throw new Error(CREATE_EMAIL_SESSION_ERROR_MESSAGE)
        })
      await expect(() => createSession('', '')).rejects.toThrowError(CREATE_EMAIL_SESSION_ERROR_MESSAGE)
    })
    it('throws an exception if unable to get the user for the session', async () => {
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          throw new Error(GET_USER_ERROR_MESSAGE)
        })
      await expect(() => createSession('', '')).rejects.toThrowError(GET_USER_ERROR_MESSAGE)
    })
    it('throws an exception if unable to store the JWT for the created session', async () => {
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          throw new Error(CREATE_JWT_ERROR_MESSAGE)
        })
      await expect(() => createSession('', '')).rejects.toThrowError(CREATE_JWT_ERROR_MESSAGE)
    })
    it('returns the user and the session after successfully creating an account and session', async () => {
      jest.spyOn(Account.prototype, 'createEmailSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
           return Promise.resolve(API_TOKEN)
        })
      const sessionAndUser = await createSession('','')
      expect(sessionAndUser).toMatchObject({
        user: testUserAccount,
        session: testEmailSession
      })
    })
  })

  describe('ending a session for a user', () => {
    it('throws an exception if unable to delete the session for user', async () => {
      jest.spyOn(Account.prototype, 'deleteSession')
        .mockImplementation(() => {
          throw new Error(DELETE_SESSION_ERROR_MESSAGE)
        })
      await expect(() => endSession()).rejects.toThrowError(DELETE_SESSION_ERROR_MESSAGE)
    })
  })

  describe('restoring an existing session for a logged in user', () => {
    it('returns null for user and session if unable to get the user from the session cookie', async () =>  {
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          throw new Error(GET_USER_ERROR_MESSAGE)
        })
      const restoredSession = await restoreExistingSession()
      expect(restoredSession).toMatchObject({
        user: null,
        session: null
      })
    })
    it('returns null for user and session if unable to get the current session for the user', async () => {
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'getSession')
        .mockImplementation(() => {
          throw new Error(GET_SESSION_ERROR_MESSAGE)
        })
      const restoredSession = await restoreExistingSession()
      expect(restoredSession).toMatchObject({
        user: null,
        session: null
      })
    })
    it('returns null for user and session if unable to store the JWT for the current session',  async () => {
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'getSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          throw new Error(CREATE_JWT_ERROR_MESSAGE)
        })
      const restoredSession = await restoreExistingSession()
      expect(restoredSession).toMatchObject({
        user: null,
        session: null
      })
    })
    it('returns the user and session if successfully able to restore session', async () => {
      jest.spyOn(Account.prototype, 'get')
        .mockImplementation(() => {
          return Promise.resolve(testUserAccount)
        })
      jest.spyOn(Account.prototype, 'getSession')
        .mockImplementation(() => {
          return Promise.resolve(testEmailSession)
        })
      jest.spyOn(Account.prototype, 'createJWT')
        .mockImplementation(() => {
          return Promise.resolve(API_TOKEN)
        })
      const restoredSession = await restoreExistingSession()
      expect(restoredSession).toMatchObject({
        user: testUserAccount,
        session: testEmailSession
      })
    })
  })
})