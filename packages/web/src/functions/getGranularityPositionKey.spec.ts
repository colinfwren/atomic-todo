import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";
import {getGranularityPositionKey} from "./getGranularityPositionKey";

describe('getGranularityPositionKey', () => {
  it('returns posInMonth when passed TodoLevel.Month', () => {
    expect(getGranularityPositionKey(TodoLevel.Month)).toBe('posInMonth')
  })
  it('returns posInWeek when passed TodoLevel.Week', () => {
    expect(getGranularityPositionKey(TodoLevel.Week)).toBe('posInWeek')
  })
  it('returns posInDay when passed TodoLevel.Day', () => {
    expect(getGranularityPositionKey(TodoLevel.Day)).toBe('posInDay')
  })
})