import {AtomicTodoTestResult} from "../AtomicTodoTestResult";

export interface AtomicTodoWriter {
  writeResult(result: AtomicTodoTestResult): void
}