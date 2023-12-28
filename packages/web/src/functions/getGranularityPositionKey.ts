import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Get the appropriate position attribute to update on the Todo for the granularity of the list it moved to
 *
 * @param {TodoLevel} granularity - The list granularity
 */
export function getGranularityPositionKey(granularity: TodoLevel): string {
  switch (granularity) {
    case TodoLevel.Month:
      return 'posInMonth'
    case TodoLevel.Week:
      return 'posInWeek'
    case TodoLevel.Day:
      return 'posInDay'
    default:
      return 'posInYear'
  }
}