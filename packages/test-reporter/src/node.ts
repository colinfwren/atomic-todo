import NodeEnvironment from 'jest-environment-node'
import createJestEnvironment from "./AtomicTodoJest";

export default createJestEnvironment(NodeEnvironment)