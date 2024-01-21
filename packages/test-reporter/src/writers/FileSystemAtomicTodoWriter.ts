import { existsSync, mkdirSync, writeFileSync } from "fs";
import {AtomicTodoWriter} from "./AtomicTodoWriter";
import { join } from "path";
import {AtomicTodoTestResult} from "../AtomicTodoTestResult";
import {AtomicTodoConfig} from "../AtomicTodoConfig";

export class FileSystemAtomicTodoWriter implements AtomicTodoWriter {
  constructor(private config: AtomicTodoConfig) {
    if (!existsSync(this.config.resultsDir)) {
      mkdirSync(this.config.resultsDir, { recursive: true })
    }
  }

  writeResult(result: AtomicTodoTestResult) {
    const path = join(this.config.resultsDir, `${result.uuid}-result.json`)
    writeFileSync(path, JSON.stringify(result), { encoding: 'utf-8' })
  }
}