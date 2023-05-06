import {getTodoListName} from "./getTodoListName";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

const boardDate = 1680303600000

describe('getTodoListName', () => {

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: 'Mon', formattedDate: '04/03', date: 1680476400000 },
    { name: 'Tue', formattedDate: '04/04', date: 1680562800000 },
    { name: 'Wed', formattedDate: '04/05', date: 1680649200000 },
    { name: 'Thu', formattedDate: '04/06', date: 1680735600000 },
    { name: 'Fri', formattedDate: '04/07', date: 1680822000000 },
    { name: 'Sat', formattedDate: '04/08', date: 1680908400000 },
    { name: 'Sun', formattedDate: '04/09', date: 1680994800000 },
  ])('returns the list name for days of the week - $name ($formattedDate)', ({name, date, formattedDate}) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Day)
    expect(listName).toEqual({ name, date: formattedDate })
  })

  // Have to use yank format because Jest runs under en-US locale
  it.each([
    { name: '1 Week', formattedDate: '04/03', date: 1680476400000 },
    { name: '2 Weeks', formattedDate: '04/10', date: 1681081200000 },
    { name: '3 Weeks', formattedDate: '04/17', date: 1681686000000 },
    { name: '4 Weeks', formattedDate: '04/24', date: 1682290800000 },
    { name: '5 Weeks', formattedDate: '05/01', date: 1682895600000 },
    { name: '6 Weeks', formattedDate: '05/08', date: 1683500400000 },
  ])('returns the list name for weeks - $name ($formattedDate)', ({ name, date, formattedDate }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Week)
    expect(listName).toEqual({ name, date: formattedDate })
  })

  it.each([
    { name: '1 Month', formattedDate: 'Apr', date: 1680303600000 },
    { name: '2 Months', formattedDate: 'May', date: 1682895600000 },
    { name: '3 Months', formattedDate: 'Jun', date: 1685574000000 },
    { name: '4 Months', formattedDate: 'Jul', date: 1688166000000 },
    { name: '5 Months', formattedDate: 'Aug', date: 1690844400000 },
    { name: '6 Months', formattedDate: 'Sep', date: 1693522800000 },
  ])('returns the list name for months - $name ($formattedDate)', ({ name, date, formattedDate }) => {
    const listName = getTodoListName(boardDate, date, TodoLevel.Month)
    expect(listName).toEqual({ name, date: formattedDate })
  })
})