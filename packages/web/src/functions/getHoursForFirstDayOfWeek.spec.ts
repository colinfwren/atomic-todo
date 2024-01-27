import {getHoursToFirstDayOfWeek} from "./getHoursForFirstDayOfWeek";

describe('getHoursForFirstDayOfWeek', () => {
  it.each([
    { expected: 0, date: new Date(1988, 0, 11, 0,0 ,0), day: 'Monday'},
    { expected: -24, date: new Date(1988, 0, 12, 0,0 ,0), day: 'Tuesday'},
    { expected: -48, date: new Date(1988, 0, 13, 0,0 ,0), day: 'Wednesday'},
    { expected: -72, date: new Date(1988, 0, 14, 0,0 ,0), day: 'Thursday'},
    { expected: -96, date: new Date(1988, 0, 15, 0,0 ,0), day: 'Friday'},
    { expected: -120, date: new Date(1988, 0, 16, 0,0 ,0), day: 'Saturday'},
    { expected: -144, date: new Date(1988, 0, 17, 0,0 ,0), day: 'Sunday'},
  ])('returns $expected hours to subtract from date when passed a $day', ({ expected, date }) => {
    expect(getHoursToFirstDayOfWeek(date)).toEqual(expected)
  })
})