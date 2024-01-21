import {AtomicTodoTestResult, Stage, Status} from "./AtomicTodoTestResult";
import {AtomicTodoRuntime} from "./AtomicTodoRuntime";
import { randomUUID } from "crypto";
import {TestType} from "./index";

export class AtomicTodoTest {
  private readonly testResult: AtomicTodoTestResult

  constructor(private readonly runTime: AtomicTodoRuntime, start: number = Date.now()) {
    this.testResult = new AtomicTodoTestResult()
    this.testResult.start = start
    this.testResult.uuid = randomUUID()
  }

  endTest(stop: number = Date.now()): void {
    this.testResult.stop = stop
    this.runTime.writeResult(this.testResult)
  }

  get uuid(): string {
    return this.testResult.uuid
  }

  set fullName(fullName: string) {
    this.testResult.fullName = fullName
  }

  set name(name: string) {
    this.testResult.name = name
  }

  set testCaseId(testCaseId: string) {
    this.testResult.testCaseId = testCaseId
  }

  set testType(testType: TestType) {
    this.testResult.testType = testType
  }

  set status(status: Status) {
    this.testResult.status = status
  }

  set stage(stage: Stage) {
    this.testResult.stage = stage
  }

  set statusDetails(details: Record<string, string>) {
    this.testResult.statusDetails = details
  }
}