import {AtomicTodoWriter} from "./AtomicTodoWriter";
import {AtomicTodoTestResult} from "../AtomicTodoTestResult";

export class InMemoryAtomicTodoWriter implements AtomicTodoWriter {
  public tests: AtomicTodoTestResult[] = []

  public writeResult(result: AtomicTodoTestResult): void {
    this.tests.push(result)
  }
}