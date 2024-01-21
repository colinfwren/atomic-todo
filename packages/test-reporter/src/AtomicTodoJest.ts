import { sep } from 'node:path'
import { JestEnvironment, EnvironmentContext, JestEnvironmentConfig } from '@jest/environment'
import { Circus } from '@jest/types'
import {AtomicTodoJestApi} from "./AtomicTodoJestApi";
import {getTestId, getTestPath, removeAnsiColorsFromString} from "./utils";
import {AtomicTodoTest} from "./AtomicTodoTest";
import {Stage, Status} from "./AtomicTodoTestResult";
import {AtomicTodoRuntime} from "./AtomicTodoRuntime";

export type MetaDataKeys = 'testCaseId' | 'testType'

export interface AtomicTodoEnvironment extends JestEnvironment {
  handleSettingTestMetaData(currentTestName: string, metaData: Partial<Record<MetaDataKeys, string>>): void
}

const createJestEnvironment = <T extends typeof JestEnvironment>(Base: T): T => {
  // @ts-expect-error (ts(2545)) Incorrect assumption about a mixin class: https://github.com/microsoft/TypeScript/issues/37142
  return class extends Base {
    testPath: string
    runtime: AtomicTodoRuntime
    runningTests: Map<string, AtomicTodoTest> = new Map()

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
      super(config, context);
      const { resultsDir = 'atomic-todo-results' } = config?.projectConfig?.testEnvironmentOptions || {}

      this.runtime = new AtomicTodoRuntime({
        resultsDir: resultsDir as string
      })
      this.global.atomicTodoTestReporter = new AtomicTodoJestApi(this, this.global)
      this.testPath = context.testPath.replace(config.globalConfig.rootDir, "").replace(sep, '')
    }

    setuo() {
      return super.setup()
    }

    teardown() {
      return super.teardown()
    }

    handleSettingTestMetaData(currentTestName: string, metaData: Partial<Record<MetaDataKeys, string>>) {
      const currentTest = this.runningTests.get(currentTestName)!
      for (const [key, value] of Object.entries(metaData)) {
        // @ts-ignore
        currentTest[key] = value
      }
    }

    handleTestEvent = (event: Circus.Event, state: Circus.State) => {
      switch (event.name) {
        case 'add_test':
          this.handleTestAdd({
            testName: event.testName,
            state
          })
          break;
        case 'test_start':
          this.handleTestStart(event.test)
          break;
        case 'test_todo':
          this.handleTestTodo(event.test)
          break;
        case 'test_fn_success':
          this.handleTestPass(event.test)
          break;
        case 'test_fn_failure':
          this.handleTestFail(event.test)
          break;
        case 'test_skip':
          this.handleTestSkip(event.test)
          break;
        case 'test_done':
          this.handleTestDone(event.test)
          break;
        default:
          break;
      }
    }

    private handleTestAdd(payload: { testName: string, state: Circus.State}) {
      const { testName, state } = payload
      const { currentDescribeBlock } = state
      const newTestSuitesPath = getTestPath(currentDescribeBlock);
      const newTestPath = newTestSuitesPath.concat(testName);
      const newTestId = getTestId(newTestPath);
      const newTest = new AtomicTodoTest(this.runtime)
      newTest.name = testName
      newTest.fullName = newTestId
      this.runningTests.set(newTestId, newTest)
    }

    private handleTestStart(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to start it!`);
        return;
      }

      currentTest.stage = Stage.RUNNING;
    }

    private handleTestPass(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to mark it as passed!`);
        return;
      }

      currentTest.stage = Stage.FINISHED;
      currentTest.status = Status.PASSED;
    }

    private handleTestFail(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to mark it as failed!`);
        return;
      }

      // jest collects all errors, but we need to report the first one because it's a reason why the test has been failed
      const [error] = test.errors;
      const hasMultipleErrors = Array.isArray(error);
      const errorMessage = (hasMultipleErrors ? error[0].message : error.message) as string;
      const errorTrace = (hasMultipleErrors ? error[0].stack : error.stack) as string;

      currentTest.stage = Stage.FINISHED;
      currentTest.status = Status.FAILED;
      currentTest.statusDetails = {
        message: removeAnsiColorsFromString(errorMessage),
        trace: removeAnsiColorsFromString(errorTrace),
      };
    }

    private handleTestSkip(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to mark it as skipped!`);
        return;
      }

      currentTest.stage = Stage.PENDING;
      currentTest.status = Status.SKIPPED;

      currentTest.endTest();
      this.runningTests.delete(currentTestId);
    }

    private handleTestDone(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to dispose it after start!`);
        return;
      }

      currentTest.endTest();
      this.runningTests.delete(currentTestId);
    }

    private handleTestTodo(test: Circus.TestEntry) {
      const currentTestId = getTestId(getTestPath(test));
      const currentTest = this.runningTests.get(currentTestId)!;

      if (!currentTest) {
        // eslint-disable-next-line no-console
        console.error(`Can't find "${currentTestId}" test while tried to mark it as todo!`);
        return;
      }

      currentTest.stage = Stage.PENDING;
      currentTest.status = Status.SKIPPED;

      currentTest.endTest();
      this.runningTests.delete(currentTestId);
    }
  }
}

export default createJestEnvironment