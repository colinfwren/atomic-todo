import {getTodoListName} from "./getTodoListName";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const boardDate = '2023-04-01T00:00:00.000+00:00'

describe('getTodoListName', () => {

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: 'Mon (04/03)', date: '2023-04-03T00:00:00.000+00:00' },
    { name: 'Tue (04/04)', date: '2023-04-04T00:00:00.000+00:00' },
    { name: 'Wed (04/05)', date: '2023-04-05T00:00:00.000+00:00' },
    { name: 'Thu (04/06)', date: '2023-04-06T00:00:00.000+00:00' },
    { name: 'Fri (04/07)', date: '2023-04-07T00:00:00.000+00:00' },
    { name: 'Sat (04/08)', date: '2023-04-08T00:00:00.000+00:00' },
    { name: 'Sun (04/09)', date: '2023-04-09T00:00:00.000+00:00' },
  ])('returns the list name for days of the week - $name', ({name, date}) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Day)
    expect(listName).toBe(name)
  })

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: '1 Week (04/03)', date: '2023-04-03T00:00:00.000+00:00' },
    { name: '2 Weeks (04/10)', date: '2023-04-10T00:00:00.000+00:00' },
    { name: '3 Weeks (04/17)', date: '2023-04-17T00:00:00.000+00:00' },
    { name: '4 Weeks (04/24)', date: '2023-04-24T00:00:00.000+00:00' },
    { name: '5 Weeks (05/01)', date: '2023-05-01T00:00:00.000+00:00' },
    { name: '6 Weeks (05/08)', date: '2023-05-08T00:00:00.000+00:00' },
  ])('returns the list name for weeks - $name', ({ name, date }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Week)
    expect(listName).toBe(name)
  })

  it.each([
    { name: '1 Month (Apr)', date: '2023-04-01T00:00:00.000+00:00' },
    { name: '2 Months (May)', date: '2023-05-01T00:00:00.000+00:00' },
    { name: '3 Months (Jun)', date: '2023-06-01T00:00:00.000+00:00' },
    { name: '4 Months (Jul)', date: '2023-07-01T00:00:00.000+00:00' },
    { name: '5 Months (Aug)', date: '2023-08-01T00:00:00.000+00:00' },
    { name: '6 Months (Sep)', date: '2023-09-01T00:00:00.000+00:00' },
  ])('returns the list name for months - $name', ({ name, date }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Month)
    expect(listName).toBe(name)
  })
})