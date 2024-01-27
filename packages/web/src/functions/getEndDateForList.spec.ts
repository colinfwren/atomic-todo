import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {getEndDateForList} from "./getEndDateForList";

describe('getEndDateForList', () => {
  it('returns the 1 day later when passed a TodoLevel.Day granularity date', () => {
    const startDate = new Date(1988, 0, 12, 0, 0 ,0)
    const expectedDate = new Date(1988, 0, 13, 0,0,0)
    const result = getEndDateForList(startDate, TodoLevel.Day)
    expect(result).toEqual(expectedDate)
  })

  it('returns a date 7 days later when passed a TodoLevel.Week granularity date', () => {
    const startDate = new Date(1988, 0, 12, 0, 0 ,0)
    const expectedDate = new Date(1988, 0, 19, 0,0,0)
    const result = getEndDateForList(startDate, TodoLevel.Week)
    expect(result).toEqual(expectedDate)
  })

  it('returns a date 1 month later when passed a TodoLevel.Month granularity date', () => {
    const startDate = new Date(1988, 0, 12, 0, 0 ,0)
    const expectedDate = new Date(1988, 1, 12, 0,0,0)
    const result = getEndDateForList(startDate, TodoLevel.Month)
    expect(result).toEqual(expectedDate)
  })
})