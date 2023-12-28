# 1. Move from tree based data structure to filtered query

Date: 2023-12-20

## Status

- 2023-12-20 proposed
- 2023-12-23 accepted

## Context

The initial data structure for this app was based on a tree of nested lists:

```mermaid
---
title: First Data Structure
---
classDiagram
    class TodoBoard{
        string name
        Date startDate
        TodoList.id[] days
        TodoList.id[] weeks
        TodoList.id[] months
    }
    class TodoList{
        TodoLevel level
        Todo.id[] todos
        TodoList.id parentList
        TodoList.id[] childLists
        Date startDate
    }
    class Todo {
        bool completed
        string name
        bool deleted
    }
    TodoBoard <-- TodoList
    TodoList <-- TodoList
    TodoList <-- Todo
```

Which was turned into a tree in the front-end like:

```mermaid
---
title: Tree structure used in the front-end
---
%%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%
graph TB
    todo1[<em>Todo:</em> A todo that appears in a month 1 only]
    todo2[<em>Todo:</em> A todo that appears in month 1 and week 2 lists]
    todo3[<em>Todo:</em> A todo that appears in month 1, week 1 and day 2 lists]
    todo4[<em>Todo:</em> A todo that appears in month 2 and week 6 lists]

    dayTodolist1["Day 1"]
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
    
    todos[<code>todos:</code> <code>Map</code> of <code>string</code> and <code>Todo</code>]
    lists[<code>lists:</code> <code>Map</code> of <code>string</code> and <code>TodoList</code>]
    board[<code>board: TodoBoard</code>]
    
    subgraph appState.todos
    todos-->todo1
    todos-->todo2
    todos-->todo3
    todos-->todo4
    end

    subgraph appState
    board-- <code>days</code>, <code>weeks</code> and <code>months</code> attributes define <code>TodoLists</code> to show in board -->lists
    lists-- <code>todos</code> attribute defines <code>Todo</code>s to show -->todos
    end

    subgraph list tree
    board-->monthTodoList1
    board-->monthTodoList2
    monthTodoList1-->weekTodoList1
    monthTodoList1-->weekTodoList2
    monthTodoList1-->weekTodoList3
    monthTodoList1-->weekTodoList4
    monthTodoList2-->weekTodoList5
    monthTodoList2-->weekTodoList6
    weekTodoList1-->dayTodolist1
    weekTodoList1-->dayTodoList2
    weekTodoList1-->dayTodoList3
    weekTodoList1-->dayTodoList4
    weekTodoList1-->dayTodoList5
    weekTodoList1-->dayTodoList6
    weekTodoList1-->dayTodoList7
    dayTodoList2-->todo3
    weekTodoList1-->todo3
    weekTodoList2-->todo2
    weekTodoList6-->todo4
    monthTodoList1-->todo1
    monthTodoList1-->todo2
    monthTodoList1-->todo3
    monthTodoList2-->todo4
    end
```

This tree structure made it hard to move the `Todo` items about as the tree would need to be traversed to update all
parent and child list depending on the move being made.

## Decision
During the discovery into building an iOS version of Atomic Todo with SwiftData I was forced to refactor the data model
to be more like one found in a relational database which meant that I could no longer rely on the tree structure.

I instead assigned a `startDate` and `endDate` to the `Todo` which would then be used within in the `TodoList` (which
had its own `startDate` and `endDate`) to filter the list of `Todo`s to only show those that fell within that the `TodoList`s
time range.

This worked really well as updates to the `startDate` and `endDate` on the `Todo` would result in the `Todo` being moved
to whichever `TodoList` covered the period for those dates and there was no need to have the complex tree traversal logic to
update the lists.

This approach also scaled well for creating more or less lists.

```mermaid
---
title: New Data Structure
---
classDiagram
    class TodoBoard{
        string name
        Date startDate
    }
    class Todo {
        bool completed
        string name
        bool deleted
        Date startDate
        Date endDate
    }
```

In the server code the `query` to get the `TodoBoard` and `Todo`s is quite simple as it now just finds all `Todo`s that
fall within the six-month period covered by the board.

In the front-end code the `TodoList`s are generated based on the granularity and the number of lists to show, with the
`startDate` and `endDate` being set based on the dates relative to the board's start date.

This means the front-end data structure looks like this:

```mermaid
---
title: Tree structure used in the front-end
---
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
    
    todos["`todos: Todo[]`"]
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

    dayTodoList2-- todos that fall within day 2-->todos
    weekTodoList1-- todos that fall within week 1-->todos
    weekTodoList2-- todos that fall within week 2-->todos
    weekTodoList6-- todos that fall within week 6-->todos
    monthTodoList1-- todos that fall within month 1-->todos
    monthTodoList2-- todos that fall within month 2-->todos
```

## Consequences

The appwrite schema, GraphQL schema, server code and front-end code will need to be refactored to work with the new data
structure. This has been tracked by the following issues:

- [Refactor Appwrite schema to remove TodoLists](https://github.com/colinfwren/atomic-todo/issues/5)
- [Refactor GraphQL schema to remove TodoList heirarchy](https://github.com/colinfwren/atomic-todo/issues/6)
- [Refactor fetching and rendering of TodoBoard to reflect GraphQL schema changes](https://github.com/colinfwren/atomic-todo/issues/11)
- [Refactor code for moving Todo between TodoLists](https://github.com/colinfwren/atomic-todo/issues/12)
- [Refactor changing Todo position in TodoList](https://github.com/colinfwren/atomic-todo/issues/21)
