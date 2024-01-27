import {getGranularityVisibilityKey} from "./getGranularityVisibilityKey";
import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

describe('getGranularityVisibilityKey', () => {
  it('returns showInMonth when passed TodoLevel.Month', () => {
    expect(getGranularityVisibilityKey(TodoLevel.Month)).toBe('showInMonth')
  })
  it('returns showInWeek when passed TodoLevel.Week', () => {
    expect(getGranularityVisibilityKey(TodoLevel.Week)).toBe('showInWeek')
  })
  it('returns showInYear when passed TodoLevel.Day', () => {
    expect(getGranularityVisibilityKey(TodoLevel.Day)).toBe('showInYear')
  })
})