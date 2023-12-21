import {getTodoListTitleDate} from "./getTodoListTitleDate";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

describe('getTodoListTitleDate', () => {
  it('returns the date for a day level list', () => {
    const result = getTodoListTitleDate(new Date(1988, 0, 12), TodoLevel.Day)
    expect(result).toEqual('12/01')
  })
  it('returns the date for a week level list', () => {
    const result = getTodoListTitleDate(new Date(2023, 11, 4), TodoLevel.Week)
    expect(result).toEqual('04/12')
  })
  it('returns the 3 letter abbreviated name of the month for a month level list', () => {
    const result = getTodoListTitleDate(new Date(2023, 11, 4), TodoLevel.Month)
    expect(result).toEqual('Dec')
  })
})