import {AtomicTodoWriter} from "./writers/AtomicTodoWriter";

export interface AtomicTodoConfig {
  readonly resultsDir: string
  readonly writer?: AtomicTodoWriter
}