import { AtomicTodoJestApi } from "./AtomicTodoJestApi";

export enum TestType {
  UNIT = 'unit',
  INTEGRATION = 'integration',
  COMPONENT = 'component',
  SYSTEM = 'system'
}

declare global {
  const atomicTodoTestReporter: AtomicTodoJestApi
}