import JSDomEnvironment from 'jest-environment-jsdom'
import createJestEnvironment from "./AtomicTodoJest";

export default createJestEnvironment(JSDomEnvironment)