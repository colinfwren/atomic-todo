import {CHILDREN_TRAVERSAL_ADD_ERROR, updateList, updateLists, updateTodoListMap} from "./listUpdates";
import {
  DAY_ONE_ID,
  DAY_TWO_ID,
  MONTH_ONE_ID,
  MONTH_TWO_ID,
  TODO_FOUR_ID,
  TODO_ID,
  TODO_SEVEN_ID,
  TODO_SIX_ID,
  todoListMap,
  WEEK_FIVE_ID,
  WEEK_ONE_ID,
  WEEK_SIX_ID,
  WEEK_TWO_ID
} from "../testData";
import {TraversalDirection, UpdateOperation} from "../types";
import exp from "constants";

const filterTodo = (todoId: string) => todoId !== TODO_ID
const dayOneList = todoListMap.get(DAY_ONE_ID)!
const dayTwoList = todoListMap.get(DAY_TWO_ID)!
const weekOneList = todoListMap.get(WEEK_ONE_ID)!
const weekTwoList = todoListMap.get(WEEK_TWO_ID)!
const weekFiveList = todoListMap.get(WEEK_FIVE_ID)!
const weekSixList = todoListMap.get(WEEK_SIX_ID)!
const monthOneList = todoListMap.get(MONTH_ONE_ID)!
const monthTwoList = todoListMap.get(MONTH_TWO_ID)!

describe('updating a TodoList with updateList', () => {
  it('adds a todo ID to a list\'s todo array when the array doesn\'t contain that ID', () => {
    const updatedMap = updateList(
      monthTwoList,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD
    )
    const expectedResult = new Map(todoListMap).set(MONTH_TWO_ID, { ...monthTwoList, todos: [...monthTwoList.todos, TODO_ID]})
    expect(updatedMap).toEqual(expectedResult)
  })
  it('only keeps one copy of todo ID in a list that has an ID added to it but already has that ID without index', () => {
    const updatedMap = updateList(
      weekOneList,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD
    )
    expect(updatedMap).toEqual(todoListMap)
  })
  it('only keeps one copy of todo ID in a list that has an ID added to it but already has that ID with index', () => {
    const updatedMap = updateList(
      weekOneList,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD,
      1
    )
    const expectedResult = new Map(todoListMap).set(WEEK_ONE_ID, { ...weekOneList, todos: [weekOneList.todos[1], TODO_ID, weekOneList.todos[2]]})
    expect(updatedMap).toEqual(expectedResult)
  })
  it('removes a todo ID from a list\'s todo array', () => {
    const updatedMap = updateList(
      weekOneList,
      TODO_ID,
      todoListMap,
      UpdateOperation.REMOVE
    )
    const expectedResult = new Map(todoListMap).set(WEEK_ONE_ID, { ...weekOneList, todos: weekOneList.todos.filter(filterTodo)})
    expect(updatedMap).toEqual(expectedResult)
  })
  it('adds todo ID at the index specified', () => {
    const updatedMap = updateList(
      weekTwoList,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD,
      0
    )
    const expectedResult = new Map(todoListMap).set(WEEK_TWO_ID, { ...weekTwoList, todos: [TODO_ID, ...weekTwoList.todos]})
    expect(updatedMap).toEqual(expectedResult)
  })
  it.each([
    { index: -1 },
    { index: 666 }
  ])('appends the Todo ID if the index is out of bounds - $index', ({ index }) => {
     const updatedMap = updateList(
      weekTwoList,
      TODO_ID,
      todoListMap,
      UpdateOperation.ADD,
      index
    )
    const expectedResult = new Map(todoListMap).set(WEEK_TWO_ID, { ...weekTwoList, todos: [...weekTwoList.todos, TODO_ID]})
    expect(updatedMap).toEqual(expectedResult)
  })
})

describe('Updating a Map of TodoLists by traversing the graph in a defined direction with updateLists', () => {

  describe('removing a todo', () => {
    const expectedTraversalResult = new Map(todoListMap)
      .set(
        DAY_ONE_ID,
        {
          ...dayOneList,
          todos: dayOneList.todos.filter(filterTodo)
        }
      )
      .set(
        WEEK_ONE_ID,
        {
          ...weekOneList,
          todos: weekOneList.todos.filter(filterTodo)
        }
      )
      .set(
        MONTH_ONE_ID,
        {
          ...monthOneList,
          todos: monthOneList.todos.filter(filterTodo)
        }
      )

    it(`updates current list and all parent lists when direction is set to ${TraversalDirection.PARENTS}`, () => {
      const updatedList = updateLists(DAY_ONE_ID, TODO_ID, todoListMap, UpdateOperation.REMOVE, TraversalDirection.PARENTS)
      expect(updatedList).toEqual(expectedTraversalResult)
    })
    it(`updates current list and all child lists when direction is set to ${TraversalDirection.CHILDREN}`, () => {
      const updatedList = updateLists(MONTH_ONE_ID, TODO_ID, todoListMap, UpdateOperation.REMOVE, TraversalDirection.CHILDREN)
      expect(updatedList).toEqual(expectedTraversalResult)
    })
    it(`updates current list only when direction is set to ${TraversalDirection.NONE}`, () => {
      const expectedResult = new Map(todoListMap)
      .set(
        MONTH_ONE_ID,
        {
          ...monthOneList,
          todos: monthOneList.todos.filter(filterTodo)
        }
      )
      const updatedList = updateLists(MONTH_ONE_ID, TODO_ID, todoListMap, UpdateOperation.REMOVE, TraversalDirection.NONE)
      expect(updatedList).toEqual(expectedResult)
    })

    it('returns the original list map if unable to find defined list in map', () => {
      const notUpdatedList = updateLists('MEH', TODO_ID, todoListMap, UpdateOperation.REMOVE, TraversalDirection.PARENTS)
      expect(notUpdatedList).toEqual(todoListMap)
    })
  })

  describe('adding a todo', () => {
    const expectedTraversalResult = new Map(todoListMap)
      .set(
        DAY_ONE_ID,
        {
          ...dayOneList,
          todos: [...dayOneList.todos, TODO_SEVEN_ID]
        }
      )
      .set(
        WEEK_ONE_ID,
        {
          ...weekOneList,
          todos: [...weekOneList.todos, TODO_SEVEN_ID]
        }
      )
      .set(
        MONTH_ONE_ID,
        {
          ...monthOneList,
          todos: [ ...monthOneList.todos, TODO_SEVEN_ID]
        }
      )

    it(`updates current list and all parent lists when direction is set to ${TraversalDirection.PARENTS}`, () => {
      const updatedList = updateLists(DAY_ONE_ID, TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.PARENTS)
      expect(updatedList).toEqual(expectedTraversalResult)
    })
    it(`throws error when direction is set to ${TraversalDirection.CHILDREN} as shouldn't be able to add to all children`, () => {
      expect(() => updateLists(MONTH_ONE_ID, TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.CHILDREN)).toThrowError(CHILDREN_TRAVERSAL_ADD_ERROR)
    })
    it(`updates current list only when direction is set to ${TraversalDirection.NONE}`, () => {
      const expectedResult = new Map(todoListMap)
      .set(
        DAY_ONE_ID,
        {
          ...dayOneList,
          todos: [...dayOneList.todos, TODO_SEVEN_ID]
        }
      )
      const updatedList = updateLists(DAY_ONE_ID, TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.NONE)
      expect(updatedList).toEqual(expectedResult)
    })
     it('returns the original list map if unable to find defined list in map', () => {
      const notUpdatedList = updateLists('MEH', TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.PARENTS)
      expect(notUpdatedList).toEqual(todoListMap)
    })
  })
  describe('adding a todo at an index', () => {
    const expectedTraversalResult = new Map(todoListMap)
      .set(
        DAY_ONE_ID,
        {
          ...dayOneList,
          todos: [TODO_SEVEN_ID, ...dayOneList.todos]
        }
      )
      .set(
        WEEK_ONE_ID,
        {
          ...weekOneList,
          todos: [...weekOneList.todos, TODO_SEVEN_ID]
        }
      )
      .set(
        MONTH_ONE_ID,
        {
          ...monthOneList,
          todos: [ ...monthOneList.todos, TODO_SEVEN_ID]
        }
      )

    it(`updates current list and all parent lists when direction is set to ${TraversalDirection.PARENTS}`, () => {
      const updatedList = updateLists(DAY_ONE_ID, TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.PARENTS, 0)
      expect(updatedList).toEqual(expectedTraversalResult)
    })
    it(`updates current list only when direction is set to ${TraversalDirection.NONE}`, () => {
      const expectedResult = new Map(todoListMap)
      .set(
        DAY_ONE_ID,
        {
          ...dayOneList,
          todos: [TODO_SEVEN_ID, ...dayOneList.todos]
        }
      )
      const updatedList = updateLists(DAY_ONE_ID, TODO_SEVEN_ID, todoListMap, UpdateOperation.ADD, TraversalDirection.NONE, 0)
      expect(updatedList).toEqual(expectedResult)
    })
  })
})

describe('Updating a Map of TodoLists when moving a Todo from one TodoList to another with updateTodoListMap', () => {
  describe('Moving a Todo from a Day list to a Day list', () => {
    it('removes the Todo from the Day list and adds it to the target Day list and keeps Week 1 and Month 1 lists intact', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, DAY_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list and adds it to the target Day list at the desired index and keeps Week 1 and Month 1 lists intact', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, DAY_TWO_ID, TODO_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_ID, ...dayTwoList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Day list to a Week list', () => {
    it('remove the Todo from Day list and keeps Week 1 and Month 1 intact when moving to Week 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_ONE_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list, Week 1 list, adds to the target Week list and keeps Month 1 list intact when target is a Week in Month 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: [...weekTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list, Week 1 list, adds to the target Week list, removes from Month 1 and adds to Month 2 when target is a Week in Month 2', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_FIVE_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: monthOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: [...weekFiveList.todos, TODO_ID]
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: [...monthTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('remove the Todo from Day list, changes index in Week 1 and keeps Month 1 intact when moving to Week 1 at desired index', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_ONE_ID, TODO_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [
              weekOneList.todos[1],
              TODO_ID,
              ...weekOneList.todos.slice(2, weekOneList.todos.length)
            ]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list, Week 1 list, adds to the target Week list at the desired index and keeps Month 1 list intact when target is a Week in Month 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_TWO_ID, TODO_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: [TODO_ID, ...weekTwoList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list, Week 1 list, adds to the target Week list at the desired index, removes from Month 1 and adds to Month 2 when target is a Week in Month 2', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, WEEK_FIVE_ID, TODO_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: monthOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: [TODO_ID, ...weekFiveList.todos]
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: [...monthTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Day list to a Month list', () => {
    it('removes the Todo from the Day list, Week 1 list and Month 1 list and adds to the target list when moving to a Month higher than 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, MONTH_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: monthOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: [...monthTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list and Week 1 list and keeps the Month 1 list intact when moving to Month 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, MONTH_ONE_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list, Week 1 list and Month 1 list and adds to the target list at the desired index when moving to a Month higher than 1', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, MONTH_TWO_ID, TODO_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: monthOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: [TODO_ID, ...monthTwoList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the Day list and Week 1 list and updates the index of the todo in the Month 1 list when moving to Month 1 with an index', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, MONTH_ONE_ID, TODO_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [
              monthOneList.todos[1],
              TODO_ID,
              ...monthOneList.todos.slice(2, monthOneList.todos.length)
            ]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Week list to a Day list', () => {
    it('adds the Todo to the Day list and keeps Week 1 and Month 1 list intact when moving from Week 1', () => {
      const map = new Map(todoListMap).set(DAY_ONE_ID, { ...dayOneList, todos: dayOneList.todos.filter(filterTodo)})
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, DAY_TWO_ID, TODO_ID, map)
      const expectedResult = new Map(map)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the Day list, Week 1 and removes it from the source Week and keeps Month 1 intact when moving from Week in Month 1', () => {
      const updatedMap = updateTodoListMap(WEEK_TWO_ID, DAY_TWO_ID, TODO_FOUR_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_FOUR_ID]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_FOUR_ID]
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: weekTwoList.todos.filter(x => x !== TODO_FOUR_ID)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the Day list, Week 1 and Month 1 and removes it from source Week and Month 2 when moving from Week in Month 2', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, DAY_TWO_ID, TODO_SIX_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the Day list at the desired index and keeps Week 1 and Month 1 list intact when moving from Week 1 with an index', () => {
      const map = new Map(todoListMap).set(DAY_ONE_ID, { ...dayOneList, todos: dayOneList.todos.filter(filterTodo)})
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, DAY_TWO_ID, TODO_ID, map, 0)
      const expectedResult = new Map(map)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_ID, ...dayTwoList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the Day list and the desired index, Week 1 and removes it from the source Week and keeps Month 1 intact when moving from Week in Month 1 with an index', () => {
      const updatedMap = updateTodoListMap(WEEK_TWO_ID, DAY_TWO_ID, TODO_FOUR_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_FOUR_ID, ...dayTwoList.todos]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_FOUR_ID]
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: weekTwoList.todos.filter(x => x !== TODO_FOUR_ID)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the Day list at the desired index, Week 1 and Month 1 and removes it from source Week and Month 2 when moving from Week in Month 2 with an index', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, DAY_TWO_ID, TODO_SIX_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_SIX_ID, ...dayTwoList.todos]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes Todo from existing Day list when moving from Week to another Day list', () => {
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, DAY_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Week list to a Week list', () => {
    it('removes the Todo from the source Week list and source Month and adds it to the target Week and it\'s parent Month when moving between Weeks in a different Month', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, WEEK_ONE_ID, TODO_SIX_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and adds it to the target Week list and keeps the month intact when moving between Weeks in the same Month', () => {
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, WEEK_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: [...weekTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and source Month and adds it to the target Week at the desired index and it\'s parent Month when moving between Weeks in a different Month with an index', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, WEEK_ONE_ID, TODO_SIX_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [TODO_SIX_ID, ...weekOneList.todos]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and adds it to the target Week list at the desired index and keeps the month intact when moving between Weeks in the same Month with an index', () => {
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, WEEK_TWO_ID, TODO_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: [TODO_ID, ...weekTwoList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Week list to a Month list', () => {
    it('removes the Todo from the source Week list and adds it to the target Month list if that Month is not the parent of the source Week', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, MONTH_ONE_ID, TODO_SIX_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SIX_ID]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and keeps the Month list intact if the target Month is the parent of the source Week', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, MONTH_TWO_ID, TODO_SIX_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and adds it to the target Month list at the desired index if that Month is not the parent of the source Week with an index', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, MONTH_ONE_ID, TODO_SIX_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [TODO_SIX_ID, ...monthOneList.todos]
          }
        )
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SIX_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes the Todo from the source Week list and changes the index in the Month list if the target Month is the parent of the source Week and pass an index', () => {
      const updatedMap = updateTodoListMap(WEEK_FIVE_ID, MONTH_TWO_ID, TODO_SIX_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_FIVE_ID,
          {
            ...weekFiveList,
            todos: weekFiveList.todos.filter(x => x !== TODO_SIX_ID)
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: [TODO_SEVEN_ID, TODO_SIX_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Month list to a Day list', () => {
    it('adds the Todo to the target Day list, Week 1 list and Month 1 list and removes it from the source Month list if not Month 1', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, DAY_TWO_ID, TODO_SEVEN_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Day list, Week 1 list and keeps Month 1 list intact if source Month is Month 1', () => {
      const map = new Map(todoListMap)
        .set(DAY_ONE_ID, { ...dayOneList, todos: dayOneList.todos.filter(filterTodo)})
        .set(WEEK_ONE_ID, { ...weekOneList, todos: weekOneList.todos.filter(filterTodo)})
      const updatedMap = updateTodoListMap(MONTH_ONE_ID, DAY_TWO_ID, TODO_ID, map)
      const expectedResult = new Map(map)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [...dayTwoList.todos, TODO_ID]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos.filter(filterTodo), TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Day list at the desired index, Week 1 list and Month 1 list and removes it from the source Month list if not Month 1 when passed index', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, DAY_TWO_ID, TODO_SEVEN_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_SEVEN_ID, ...dayTwoList.todos]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Day list at the desired index, Week 1 list and keeps Month 1 list intact if source Month is Month 1 when passed index', () => {
      const map = new Map(todoListMap)
        .set(DAY_ONE_ID, { ...dayOneList, todos: dayOneList.todos.filter(filterTodo)})
        .set(WEEK_ONE_ID, { ...weekOneList, todos: weekOneList.todos.filter(filterTodo)})
      const updatedMap = updateTodoListMap(MONTH_ONE_ID, DAY_TWO_ID, TODO_ID, map, 0)
      const expectedResult = new Map(map)
        .set(
          DAY_TWO_ID,
          {
            ...dayTwoList,
            todos: [TODO_ID, ...dayTwoList.todos]
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos.filter(filterTodo), TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from a Month list to Week list', () => {
    it('adds the Todo to the target Week list and keeps the source Month intact if the target Week is in the source Month', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, WEEK_SIX_ID, TODO_SEVEN_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_SIX_ID,
          {
            ...weekSixList,
            todos: [...weekSixList.todos, TODO_SEVEN_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Week list, the Month the target Week is in and removes it from the source Month if the target Week is not in the source Month', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, WEEK_ONE_ID, TODO_SEVEN_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [...weekOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Week list at the desired index and keeps the source Month intact if the target Week is in the source Month when passed index', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, WEEK_SIX_ID, TODO_SEVEN_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_SIX_ID,
          {
            ...weekSixList,
            todos: [TODO_SEVEN_ID, ...weekSixList.todos]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('adds the Todo to the target Week list at the desired index, the Month the target Week is in and removes it from the source Month if the target Week is not in the source Month when passed an index', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, WEEK_ONE_ID, TODO_SEVEN_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [TODO_SEVEN_ID, ...weekOneList.todos]
          }
        )
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
            MONTH_TWO_ID,
            {
              ...monthTwoList,
              todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
            }
          )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes Todo from existing Week list and adds to target Week list when moving from Month list to different Week that currently in', () => {
      const updatedMap = updateTodoListMap(MONTH_ONE_ID, WEEK_TWO_ID, TODO_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: dayOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: weekOneList.todos.filter(filterTodo)
          }
        )
        .set(
          WEEK_TWO_ID,
          {
            ...weekTwoList,
            todos: [...weekTwoList.todos, TODO_ID]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo from Month list to Month list', () => {
    it('removes Todo from the source Month list and adds it to the target Month list', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, MONTH_ONE_ID, TODO_SEVEN_ID, todoListMap)
      const expectedResult = new Map(todoListMap)
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [...monthOneList.todos, TODO_SEVEN_ID]
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('removes Todo from the source Month list and adds it to the target Month list at the desired index when passed an index', () => {
      const updatedMap = updateTodoListMap(MONTH_TWO_ID, MONTH_ONE_ID, TODO_SEVEN_ID, todoListMap, 0)
      const expectedResult = new Map(todoListMap)
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [TODO_SEVEN_ID, ...monthOneList.todos]
          }
        )
        .set(
          MONTH_TWO_ID,
          {
            ...monthTwoList,
            todos: monthTwoList.todos.filter(x => x !== TODO_SEVEN_ID)
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
  describe('Moving a Todo within the same list to reorder the Todos', () => {
    it('reorders the Todos in a Day List based on the index', () => {
      const updatedMap = updateTodoListMap(DAY_ONE_ID, DAY_ONE_ID, TODO_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          DAY_ONE_ID,
          {
            ...dayOneList,
            todos: [
              dayOneList.todos[1],
              TODO_ID,
              ...dayOneList.todos.slice(2, dayOneList.todos.length)
            ]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('reorders the Todos in a Week List based on the index', () => {
      const updatedMap = updateTodoListMap(WEEK_ONE_ID, WEEK_ONE_ID, TODO_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          WEEK_ONE_ID,
          {
            ...weekOneList,
            todos: [
              weekOneList.todos[1],
              TODO_ID,
              ...weekOneList.todos.slice(2, weekOneList.todos.length)
            ]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
    it('reorders the Todos in a Month List based on the index', () => {
      const updatedMap = updateTodoListMap(MONTH_ONE_ID, MONTH_ONE_ID, TODO_ID, todoListMap, 1)
      const expectedResult = new Map(todoListMap)
        .set(
          MONTH_ONE_ID,
          {
            ...monthOneList,
            todos: [
              monthOneList.todos[1],
              TODO_ID,
              ...monthOneList.todos.slice(2, monthOneList.todos.length)
            ]
          }
        )
      expect(updatedMap).toEqual(expectedResult)
    })
  })
})