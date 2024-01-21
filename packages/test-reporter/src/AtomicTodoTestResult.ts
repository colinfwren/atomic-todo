import {TestType} from "./index";

export class AtomicTodoTestResult {
  uuid: string
  name: string
  fullName: string
  testCaseId: string
  stop: number
  start: number
  stage: Stage
  status: Status
  statusDetails: Record<string, string>
  testType: TestType
}

export enum Status {
  FAILED = 'failed',
  BROKEN = 'broken',
  PASSED = 'passed',
  SKIPPED = 'skipped'
}

export enum Stage {
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  FINISHED = 'finished',
  PENDING = 'pending',
  INTERRUPTED = 'interrupted'
}

