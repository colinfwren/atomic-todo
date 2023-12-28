import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  MouseSensor,
  UniqueIdentifier,
  useSensors,
  useSensor, DragOverEvent, Over, Active, DragCancelEvent
} from "@dnd-kit/core";
import {TodoItemBoard} from "../TodoItemBoard/TodoItemBoard";
import React, {useContext, useState} from "react";
import TodoBoardContext from "../../contexts/TodoBoardContext";
import {TodoItem} from "../TodoItem/TodoItem";
import {createPortal} from "react-dom";
import {Modal} from "../Modal/Modal";
import {TodoBoardState, TodoListMap} from "../../types";
import {getAppStateFromTodoBoardResult} from "../../functions/getAppStateFromTodoBoardResult";
import {Todo} from "@atomic-todo/server/dist/src/generated/graphql";
import {getGranularityPositionKey} from "../../functions/getGranularityPositionKey";
import {getGranularityVisibilityKey} from "../../functions/getGranularityVisibilityKey";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const measuringStrategy = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
}

/**
 * Container for drag and drop in app
 *
 * @returns {JSX.Element} Drag 'n' Drop wrapper over TodoItemBoard
 */
export function Container(): JSX.Element {
  const { modal, board, todos, lists, actions: { updateTodos, setAppState } } = useContext(TodoBoardContext)
  const [activeId, setActiveId] = useState<UniqueIdentifier|null>(null)
  const [sourceListId, setSourceListId] = useState<string|null>(null)
  const [appStateCopy, setAppStateCopy] = useState<TodoBoardState|null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  /**
   * Callback for when a drag 'n' drop operation has started
   *
   * @param {DragStartEvent} event - The drag start event
   */
  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveId(event.active.id)
      setSourceListId(event.active.data.current.listId as string)
      setAppStateCopy({ board, todos, lists })
    }
  }

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  /*const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{id: overId}];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{id: lastOverId.current}] : [];
    },
    [activeId, items]
  );*/

  /**
   * Calculate the new index of the active item in the list of todos in the list being dragged over
   *
   * @param {Over} over - The Todo the item is being dragged over
   * @param {Active} active - The Todo item being dragged
   * @returns {number} - The index the active todo would be in the list being dragged over
   */
  function getIndexForDraggedItem(over: Over, active: Active) {
    const overId = over?.data.current?.todoId as string
    const overContainer = over?.data.current?.listId
    const overItems = lists.get(overContainer)!.todos
    const overIndex = overItems.indexOf(overId)
    if (lists.has(overId)) {
      return overItems.length + 1
    } else {
      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top >
          over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1
    }
  }

  /**
   * Handle drag over event
   *
   * @param {DragOverEvent} event - The drag over event
   */
  function handleDragOver({ active, over }: DragOverEvent) {
    const overId = over?.id

    if (overId == null) return

    const overContainer = over?.data.current?.listId
    const activeContainer = active.data.current?.listId

    if (!overContainer || !activeContainer) return

    const activeId = active.data.current?.todoId as string
    const newIndex = getIndexForDraggedItem(over, active)

    const sourceList = lists.get(activeContainer)!
    const targetList = lists.get(overContainer)!
    const sourcePositionKey = getGranularityPositionKey(sourceList.granularity)
    const targetPositionKey = getGranularityPositionKey(targetList.granularity)
    const visibilityKey = getGranularityVisibilityKey(targetList.granularity)

    const targetListTodosWithoutActiveTodo = targetList.todos.filter(todo => todo !== activeId)
    const targetListTodosWithActiveTodo = [
      ...targetListTodosWithoutActiveTodo.slice(0, newIndex),
      activeId,
      ...targetListTodosWithoutActiveTodo.slice(newIndex)
    ]

    const sourceListTodosWithoutActiveTodo = sourceList.todos.filter((todo) => todo !== activeId)

    const updatedTodos: Todo[] = [...todos.values()].map((todo) => {
      if (todo.id === activeId) {
        if (sourceList.id == targetList.id) {
          return {
            ...todo,
            [targetPositionKey]: newIndex,
          }
        }
        return {
          ...todo,
          [targetPositionKey]: newIndex,
          [visibilityKey]: true,
          startDate: targetList.listStartDate.getTime() / 1000,
          endDate: targetList.listEndDate.getTime() / 1000
        }
      }
      else {
        if (sourceList.id !== targetList.id && sourceList.todos.includes(todo.id)) {
          return {
            ...todo,
            [sourcePositionKey]: sourceListTodosWithoutActiveTodo.indexOf(todo.id)
          }
        }
        // @ts-ignore
        if (targetList.todos.includes(todo.id)) {
          return {
            ...todo,
            [targetPositionKey]: targetListTodosWithActiveTodo.indexOf(todo.id)
          }
        }
      }
      return todo
    })
    const newAppState = getAppStateFromTodoBoardResult({ board: { ...board, startDate: board.startDate.getTime() / 1000 }, todos: updatedTodos})
    setAppState(newAppState)
  }

  /**
   * Callback for when a drag 'n' drop operation has ended
   *
   * @param {DragEndEvent} event - The drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (event.over !== null && event.over.data.current && event.active !== null && event.active.data.current && sourceListId !== null) {
      const overContainer = event.over.data.current.listId
      const sourceList = lists.get(sourceListId)!
      const targetList = lists.get(overContainer)!
      const todosToUpdate = new Set([...sourceList.todos, ...targetList.todos])
      updateTodos([...todosToUpdate].map((todoId) => todos.get(todoId)!))
    }
    setActiveId(null)
    setSourceListId(null)
    setAppStateCopy(null)
  }



  /**
   * Handle cancelling the drag
   */
  function handleDragCancel() {
    if (appStateCopy !== null) {
      setAppState(appStateCopy)
      setAppStateCopy(null)
    }
    setActiveId(null)
    setSourceListId(null)
  }

  return(
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      measuring={measuringStrategy}
      sensors={sensors}
      // collisionDetection={collisionDetectionStrategy}
    >
      <div className="App">
        <TodoItemBoard />
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeId ? <TodoItem id={(activeId as string).split('_')[1]} index={0} dragOverlay /> : null}
        </DragOverlay>,
        document.body
      )}
      {modal.visible && createPortal(
        <Modal />,
        document.body
      )}
    </DndContext>
  )
}