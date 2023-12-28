import {TodoLevel} from "@atomic-todo/server/dist/src/generated/graphql";

/**
 * Get the appropriate flag to update on the Todo for the granularity of the list it moved to
 *
 * @param {TodoLevel} granularity - The list granularity
 */
export function getGranularityVisibilityKey(granularity: TodoLevel): string {
  switch (granularity) {
    case TodoLevel.Month:
      return 'showInMonth'
    case TodoLevel.Week:
      return 'showInWeek'
    default:
      return 'showInYear'
  }
}