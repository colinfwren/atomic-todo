import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {getStartDateForList} from "./getStartDateForList";
import {todoBoard} from "../testData";

describe('getStartDateForList', () => {
  it.each([
    { delta: 0, expectedListStartDate: new Date(1988, 0, 11, 0, 0, 0)},
    { delta: 1, expectedListStartDate: new Date(1988, 0, 12, 0, 0, 0)},
    { delta: 2, expectedListStartDate: new Date(1988, 0, 13, 0, 0, 0)},
    { delta: 3, expectedListStartDate: new Date(1988, 0, 14, 0, 0, 0)},
    { delta: 4, expectedListStartDate: new Date(1988, 0, 15, 0, 0, 0)},
    { delta: 5, expectedListStartDate: new Date(1988, 0, 16, 0, 0, 0)},
    { delta: 6, expectedListStartDate: new Date(1988, 0, 17, 0, 0, 0)},
  ])(`returns a start date that is $delta days in the future from the first Monday in the week of the board start date`, ({ delta, expectedListStartDate}) => {
    const result = getStartDateForList(todoBoard.startDate, TodoLevel.Day, delta)
    expect(result).toEqual(expectedListStartDate)
  })

  it.each([
    { delta: 0, expectedListStartDate: new Date(1988, 0, 11, 0, 0, 0)},
    { delta: 1, expectedListStartDate: new Date(1988, 0, 18, 0, 0, 0)},
    { delta: 2, expectedListStartDate: new Date(1988, 0, 25, 0, 0, 0)},
    { delta: 3, expectedListStartDate: new Date(1988, 1, 1, 0, 0, 0)},
    { delta: 4, expectedListStartDate: new Date(1988, 1, 8, 0, 0, 0)},
    { delta: 5, expectedListStartDate: new Date(1988, 1, 15, 0, 0, 0)},
  ])(`returns a start date that is $delta weeks in the future from the first Monday in the week of the board start date`, ({ delta, expectedListStartDate}) => {
    const result = getStartDateForList(todoBoard.startDate, TodoLevel.Week, delta)
    expect(result).toEqual(expectedListStartDate)
  })

  it.each([
    { delta: 0, expectedListStartDate: new Date(1988, 0, 1, 0, 0, 0)},
    { delta: 1, expectedListStartDate: new Date(1988, 1, 1, 0, 0, 0)},
    { delta: 2, expectedListStartDate: new Date(1988, 2, 1, 0, 0, 0)},
    { delta: 3, expectedListStartDate: new Date(1988, 3, 1, 0, 0, 0)},
    { delta: 4, expectedListStartDate: new Date(1988, 4, 1, 0, 0, 0)},
    { delta: 5, expectedListStartDate: new Date(1988, 5, 1, 0, 0, 0)},
  ])(`returns a start date that is $delta months in the future from the month of the board start date`, ({ delta, expectedListStartDate}) => {
    const result = getStartDateForList(todoBoard.startDate, TodoLevel.Month, delta)
    expect(result).toEqual(expectedListStartDate)
  })
})