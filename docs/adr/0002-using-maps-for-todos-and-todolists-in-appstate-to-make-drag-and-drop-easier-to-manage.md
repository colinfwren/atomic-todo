# 2. Using Maps of Todos and TodoLists in AppState to make drag and drop easier to manage

Date: 2023-12-26

## Status

2023-12-26 proposed
2023-12-27 accepted

## Context

With the refactor from tree based data structure to filtered query there's no longer a quick means to look up which 
`Todos` are in a Todo list or to access a `Todo` directly in the front-end. 

This makes it harder to manage the drag and drop functionality
as there needs to be some concept of a `TodoList` to move the items between or within.

This proposal is to re-introduce the `TodoList` structure and to have `AppState` work with `Map`s of `TodoList`s and 
`Todo`s so that the front-end can both organise and render the todo lists in a more efficient manner.

```mermaid
---
title: Current AppState
---
classDiagram
    class Todo{
        string id
        bool completed
        string name
        bool deleted
        Date startDate
        Date endDate
        bool showInMonth
        bool showInWeek
        bool showInDay
        int posInMonth
        int posInWeek
        int posInDay
    }
    class AppTodo {
        string monthListId
        string weekListId
        string dayListId
    }
    class TodoBoard {
        string id
        string name
        Date startDate
    }
    class TodoList {
        string id
        Date startDate
        Date endDate
        TodoLevel granularity
        string[] todoIds
    }
    class AppState {
        TodoBoard board
        Map&lt;TodoList.id, TodoList&gt; lists
        Map&lt;Todo.id, Todo&gt; todos
    }
    Todo <|-- AppTodo: extends Todo with values to help reverse look up TodoList
    AppState --> Todo
    AppState --> TodoList
    AppState --> TodoBoard
```

When the front-end receives the data from the GraphQL responses it'll create the maps which will then be used in the app
state to render the lists.

```mermaid
%%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%
flowchart
    todo1[<em>Todo:</em> A todo that appears in a month 1 only]
    todo2[<em>Todo:</em> A todo that appears in month 1 and week 2 lists]
    todo3[<em>Todo:</em> A todo that appears in month 1, week 1 and day 2 lists]
    todo4[<em>Todo:</em> A todo that appears in month 2 and week 6 lists]

    dayTodoList1["Day 1"]
    dayTodoList2["Day 2"]
    dayTodoList3["Day 3"]
    dayTodoList4["Day 4"]
    dayTodoList5["Day 5"]
    dayTodoList6["Day 6"]
    dayTodoList7["Day 7"]
    weekTodoList1["Week 1"]
    weekTodoList2["Week 2"]
    weekTodoList3["Week 3"]
    weekTodoList4["Week 4"]
    weekTodoList5["Week 5"]
    weekTodoList6["Week 6"]
    monthTodoList1["Month 1"]
    monthTodoList2["Month 2"]
    
    todos["todos: Map#lt;string, Todo#gt;"]
    lists["lists: Map#lt;string, TodoList#gt;"]
    monthRow["`monthRow: TodoList[]`"]
    weekRow["`weekRow: TodoList[]`"]
    dayRow["`dayRow: TodoList[]`"]
    
    todos-->todo1
    todos-->todo2
    todos-->todo3
    todos-->todo4

    subgraph month row
    monthRow-->monthTodoList1
    monthRow-->monthTodoList2
    end

    subgraph week row
    weekRow-->weekTodoList1
    weekRow-->weekTodoList2
    weekRow-->weekTodoList3
    weekRow-->weekTodoList4
    weekRow-->weekTodoList5
    weekRow-->weekTodoList6
    end

    subgraph day row
    dayRow-->dayTodoList1
    dayRow-->dayTodoList2
    dayRow-->dayTodoList3
    dayRow-->dayTodoList4
    dayRow-->dayTodoList5
    dayRow-->dayTodoList6
    dayRow-->dayTodoList7
    end

    lists-- defines month lists -->monthRow
    lists-- defines week lists -->weekRow
    lists-- defines day lists -->dayRow
    dayTodoList2-- todos that fall within day 2-->todos
    weekTodoList1-- todos that fall within week 1-->todos
    weekTodoList2-- todos that fall within week 2-->todos
    weekTodoList6-- todos that fall within week 6-->todos
    monthTodoList1-- todos that fall within month 1-->todos
    monthTodoList2-- todos that fall within month 2-->todos
```

Then when changing the position of a `Todo` in a `TodoList` (not moving it between lists). The following can be done

```mermaid
sequenceDiagram
    actor User
    participant Todo
    participant TodoList
    participant Container
    participant TodoBoardContext
    participant AppState
    participant GraphQL
    
    Note over User,Container: onDragStart
    User->>Todo: Starts Drag
    Todo->>Container: Sets ID of Todo being dragged in Container state
    Container-->User: Renders the dragged Todo in UI so User has feedback
    
    Note over User,Container: onDragOver
    User->>TodoList: Drags Todo to new position in list
    TodoList->>Container: Triggers onDragOver callback
    Container-->TodoList: Uses ID of Todo being dragged and the ID of the list being dragged over to reposition Todos in list
    TodoList-->User: Updates Todos in list with new positions
    
    Note over User,GraphQl: onDragEnd
    User->>TodoList: Drops Todo at desired position
    TodoList->>Container: Uses ID of Todo being dragged and the ID of list dropped on to update positions of Todos in AppState
    Container->>TodoBoardContext: Calls updateTodos for affected Todos which is determined by looking at which Todos are in TodoList
    TodoBoardContext->>GraphQL: Makes call to back-end to do update in Appwrite
    GraphQL-->AppState: Gets updated Todo data to put into state as part of response (optimistic rendering should already have updated UI)
    AppState-->User: Update to AppState causes TodoBoard to re-render
```

Then when moving a `Todo` from one `TodoList` to another, the following can be done.

```mermaid
sequenceDiagram
    actor User
    participant Todo
    participant TodoList
    participant Container
    participant TodoBoardContext
    participant AppState
    participant GraphQL
    
    Note over User,Container: onDragStart
    User->>Todo: Starts Drag
    Todo->>Container: Sets ID of Todo being dragged in Container state
    Container-->User: Renders the dragged Todo in UI so User has feedback
    
    Note over User,Container: onDragOver
    User->>TodoList: Drags Todo to a new TodoList
    TodoList->>Container: Triggers onDragOver callback
    Container-->TodoList: Uses ID of Todo being dragged and the ID of the list being dragged over to reposition Todos in list
    TodoList-->User: Updates Todos in list with new positions
    
    Note over User,GraphQl: onDragEnd
    User->>TodoList: Drops Todo at desired position
    TodoList->>Container: Uses ID of Todo being dragged and the ID of list dropped on to update positions of Todos in source and target TodoLists in AppState
    Container->>TodoBoardContext: Calls updateTodos for affected Todos which is determined by looking at which Todos are in source and target TodoLists
    TodoBoardContext->>GraphQL: Makes call to back-end to do update in Appwrite
    GraphQL-->AppState: Gets updated Todo data to put into state as part of response (optimistic rendering should already have updated UI)
    AppState-->User: Update to AppState causes TodoBoard to re-render
```

## Decision

I decided to go with it as was how the app was previously working and using a `Map` gives a nice API for finding `TodoList`s 
and `Todo`s based on ID.
 
## Consequences

Will need to refactor `AppState` and `onDragStart`, `onDragOver` and `onDragEnd` callbacks in `Container` (although this
would likely just be bringing back old tree data structure callback code for the most part).

There's a potential this could be done in the back-end but as `TodoList` is really a display need instead of a data need
I don't think this too good an idea.
