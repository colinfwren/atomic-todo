import {AtomicTodoWriter} from "./writers/AtomicTodoWriter";
import {AtomicTodoTestResult} from "./AtomicTodoTestResult";
import {AtomicTodoConfig} from "./AtomicTodoConfig";
import {InMemoryAtomicTodoWriter} from "./writers/InMemoryAtomicTodoWriter";

export class AtomicTodoRuntime {
  writer: AtomicTodoWriter

  constructor(private config: AtomicTodoConfig) {
    this.writer = config.writer || new InMemoryAtomicTodoWriter
  }

  writeResult(result: AtomicTodoTestResult): void {
    this.writer.writeResult(result)
  }
}