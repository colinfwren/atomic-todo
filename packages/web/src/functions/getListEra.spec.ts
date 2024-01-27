import {getListEra} from "./getListEra";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {TodoListEra} from "../types";

const currentDate = new Date(1988, 0, 12, 0, 0,0)
describe('getListEra', () => {
  it('returns TodoListEra.past if day todo list start date is before current date', () => {
    const startDate = new Date(1988, 0, 11, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Day)
    expect(result).toBe(TodoListEra.past)
  })
  it('returns TodoListEra.current if day todo list start date is equal to current date', () => {
    const startDate = new Date(1988, 0, 12, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Day)
    expect(result).toBe(TodoListEra.current)
  })
  it('returns TodoListEra.future if day todo list start date is after to current date', () => {
    const startDate = new Date(1988, 0, 13, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Day)
    expect(result).toBe(TodoListEra.future)
  })
  it('returns TodoListEra.past if week todo list start date is 6 days or more before the current date', () => {
    const startDate = new Date(1988, 0, 5, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Week)
    expect(result).toBe(TodoListEra.past)
  })
  it('returns TodoListEra.future if week todo list start date is after the current date', () => {
    const startDate = new Date(1988, 0, 19, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Week)
    expect(result).toBe(TodoListEra.future)
  })
  it('returns TodoListEra.past if month todo list start date is before the start of the month for the current date', () => {
    const startDate = new Date(1987, 11, 26, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Month)
    expect(result).toBe(TodoListEra.past)
  })
  it('returns TodoListEra.future if month todo list start date is after the start of the month for the current date', () => {
    const startDate = new Date(1988, 1, 1, 0, 0, 0)
    const result = getListEra(currentDate, startDate, TodoLevel.Month)
    expect(result).toBe(TodoListEra.future)
  })
})