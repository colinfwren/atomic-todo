import {
  day1List,
  dayListOnlyTodo,
  dayTodo,
  dayWeekListOnlyTodo, month1List,
  week1List,
  week462023Todo,
  week482023Todo, week522023Todo
} from "../testData";
import {getTodosForGranularity} from "./getTodosForGranularity";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";


const otherTodo = {
  ...dayTodo,
    id: 'day 2 todo',
    startDate: dayTodo.endDate,
    endDate: 1700006400
}
describe('getTodosForGranularity', () => {
  it('returns Todos that fall within day list\'s start and end dates', () => {
    const todos = [
      dayTodo,
      otherTodo
    ]
    const result = getTodosForGranularity(day1List.listStartDate, day1List.listEndDate, TodoLevel.Day, todos)
    const expectedResult = [dayTodo]
    expect(result).toEqual(expectedResult)
  })
  it('returns Todos that fall within week list\'s start and end dates and are set to be shown in week list', () => {
    const todos = [
      dayTodo,
      otherTodo,
      dayListOnlyTodo,
      week462023Todo,
      week482023Todo,
    ]
    const result = getTodosForGranularity(week1List.listStartDate, week1List.listEndDate, TodoLevel.Week, todos)
    const expectedResult = [dayTodo, otherTodo, week462023Todo]
    expect(result).toEqual(expectedResult)
  })
  it('returns Todos that fall within month list\'s month and are set to be shown in month list', () => {
    const todos = [
      dayTodo,
      otherTodo,
      dayListOnlyTodo,
      dayWeekListOnlyTodo,
      week462023Todo,
      week482023Todo,
      week522023Todo,
    ]
    const result = getTodosForGranularity(month1List.listStartDate, month1List.listEndDate, TodoLevel.Month, todos)
    const expectedResult = [dayTodo, otherTodo, week462023Todo, week482023Todo]
    expect(result).toEqual(expectedResult)
  })
})