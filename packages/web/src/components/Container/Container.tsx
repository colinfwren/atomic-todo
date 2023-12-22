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
import AppContext from "../../contexts/AppContext";
import {TodoItem} from "../TodoItem/TodoItem";
import {createPortal} from "react-dom";
import {Modal} from "../Modal/Modal";

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
  const { modal, todos, actions: { setTodoDateSpan } } = useContext(AppContext)
  const [activeId, setActiveId] = useState<UniqueIdentifier|null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  /**
   * Callback for when a drag 'n' drop operation has ended
   *
   * @param {DragEndEvent} event - The drag end event
   */
  function handleDragEnd(event: DragEndEvent) {
    if (event.over !== null && event.over.data.current && event.active !== null && event.active.data.current) {
      const { type, listStartDate, listEndDate, granularity } = event.over.data.current
      const todo = todos.find((todo) => todo.id === event.active.data.current?.todoId)
      if (type === 'list' && todo) {
        setTodoDateSpan(todo, listStartDate, listEndDate, granularity)
      }
    }
    setActiveId(null)
  }

  /**
   * Callback for when a drag 'n' drop operation has started
   *
   * @param {DragStartEvent} event - The drag start event
   */
  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveId(event.active.id)
    }
  }

  /**
   * Handle cancelling the drag
   *
   * @param {DragCancelEvent} event - The drag cancel event
   */
  function handleDragCancel(event: DragCancelEvent) {
    setActiveId(null)
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
    // const overId = over?.data.current?.todoId as string
    // const overContainer = over?.data.current?.listId
    // const overItems = lists.get(overContainer)!.todos
    // const overIndex = overItems.indexOf(overId)
    // if (lists.has(overId)) {
    //   return overItems.length + 1;
    // } else {
    //   const isBelowOverItem =
    //     over &&
    //     active.rect.current.translated &&
    //     active.rect.current.translated.top >
    //       over.rect.top + over.rect.height;
    //
    //   const modifier = isBelowOverItem ? 1 : 0;
    //
    //   return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    // }
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