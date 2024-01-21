import type { JestExpect } from '@jest/expect'
import type { Global } from '@jest/types'
import {AtomicTodoEnvironment, MetaDataKeys} from "./AtomicTodoJest";

export class AtomicTodoJestApi {
  env: AtomicTodoEnvironment
  context: Global.Global

  constructor(env: AtomicTodoEnvironment, context: Global.Global) {
    this.env = env
    this.context = context
  }

  async setTestMetaData(metaData: Partial<Record<MetaDataKeys, string>>) {
    const { currentTestName } = (this.context.expect as JestExpect).getState()

    return new Promise((resolve) => {
      this.env.handleSettingTestMetaData(currentTestName!, metaData)
      return resolve(void 0);
    })
  }

  metaData(metaData: Partial<Record<MetaDataKeys, string>>): void {
    this.setTestMetaData(metaData)
  }
}