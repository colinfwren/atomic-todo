import {getTodoListName} from "./getTodoListName";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const boardDate = '2023-04-01T00:00:00.000+00:00'

describe('getTodoListName', () => {

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: 'Mon', formattedDate: '04/03', date: '2023-04-03T00:00:00.000+00:00' },
    { name: 'Tue', formattedDate: '05/03', date: '2023-04-04T00:00:00.000+00:00' },
    { name: 'Wed', formattedDate: '06/03', date: '2023-04-05T00:00:00.000+00:00' },
    { name: 'Thu', formattedDate: '07/03', date: '2023-04-06T00:00:00.000+00:00' },
    { name: 'Fri', formattedDate: '08/03', date: '2023-04-07T00:00:00.000+00:00' },
    { name: 'Sat', formattedDate: '09/03', date: '2023-04-08T00:00:00.000+00:00' },
    { name: 'Sun', formattedDate: '10/03', date: '2023-04-09T00:00:00.000+00:00' },
  ])('returns the list name for days of the week - $name ($formattedDate)', ({name, date, formattedDate}) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Day)
    expect(listName).toEqual({ name, date: formattedDate })
  })

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: '1 Week', formattedDate: '04/03', date: '2023-04-03T00:00:00.000+00:00' },
    { name: '2 Weeks', formattedDate: '04/10', date: '2023-04-10T00:00:00.000+00:00' },
    { name: '3 Weeks', formattedDate: '04/17', date: '2023-04-17T00:00:00.000+00:00' },
    { name: '4 Weeks', formattedDate: '04/24', date: '2023-04-24T00:00:00.000+00:00' },
    { name: '5 Weeks', formattedDate: '05/01', date: '2023-05-01T00:00:00.000+00:00' },
    { name: '6 Weeks', formattedDate: '05/08', date: '2023-05-08T00:00:00.000+00:00' },
  ])('returns the list name for weeks - $name ($formattedDate)', ({ name, date, formattedDate }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Week)
    expect(listName).toBe({ name, date: formattedDate })
  })

  it.each([
    { name: '1 Month', formattedDate: 'Apr', date: '2023-04-01T00:00:00.000+00:00' },
    { name: '2 Months', formattedDate: 'May', date: '2023-05-01T00:00:00.000+00:00' },
    { name: '3 Months', formattedDate: 'Jun', date: '2023-06-01T00:00:00.000+00:00' },
    { name: '4 Months', formattedDate: 'Jul', date: '2023-07-01T00:00:00.000+00:00' },
    { name: '5 Months', formattedDate: 'Aug', date: '2023-08-01T00:00:00.000+00:00' },
    { name: '6 Months', formattedDate: 'Sep', date: '2023-09-01T00:00:00.000+00:00' },
  ])('returns the list name for months - $name ($formattedDate)', ({ name, date, formattedDate }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Month)
    expect(listName).toBe({ name, date: formattedDate })
  })
})