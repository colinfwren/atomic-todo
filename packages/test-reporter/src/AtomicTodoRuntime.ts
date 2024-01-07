import {AtomicTodoWriter} from "./writers/AtomicTodoWriter";
import {AtomicTodoTestResult} from "./AtomicTodoTestResult";
import {AtomicTodoConfig} from "./AtomicTodoConfig";
import {FileSystemAtomicTodoWriter} from "./writers/FileSystemAtomicTodoWriter";

export class AtomicTodoRuntime {
  writer: AtomicTodoWriter

  constructor(private config: AtomicTodoConfig) {
    this.writer = config.writer || new FileSystemAtomicTodoWriter(config)
  }

  writeResult(result: AtomicTodoTestResult): void {
    this.writer.writeResult(result)
  }
}