# Moving a todo

## Happy Path Flows

### Authenticated user changes position of Todo in TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user changes position of Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Change position of Todo in TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Change position of Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Change position of Todo in TodoList
```mermaid
---
title: Change position of Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Change position of Todo in TodoList
    frontend->>frontend: Handle repositioning of Todo in TodoList
    frontend->>backend: Call API to update positions of Todos
    backend->>appwrite: Update Todos
    appwrite->>backend: Confirm Todos updated
    backend->>frontend: Confirm Todos updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```

### Authenticated user moves Todo from one TodoList to another TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user moves Todo from one TodoList to another TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move Todo from one TodoList to another TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Move Todo from one TodoList to another TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Move Todo from one TodoList to another TodoList
```mermaid
---
title: Move Todo from one TodoList to another TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move Todo from one TodoList to another TodoList
    frontend->>frontend: Handle reposition of Todo in target TodoList
    frontend->>frontend: Handle repositioning of Todos in source TodoList
    frontend->>backend: Call API to update Todos in source and target TodoLists
    backend->>appwrite: Update Todos
    appwrite->>backend: Confirm Todos updated
    backend->>frontend: Confirm Todos updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```

## Alternate Path Flows
### User with timed-out session attempts to change position of Todo in TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to change position of Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Change position Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject changing position Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Change position Todo in TodoList
```mermaid
---
title: Change position Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Change position of Todo in TodoList
    frontend->>frontend: Handle repositioning of Todo in TodoList
    frontend->>backend: Call API to update positions of Todos
    backend->>appwrite: Update Todos
    appwrite->>backend: Reject Todo updates
    backend->>frontend: Reject Todo updates
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```

### User with timed-out session attempts to move Todo from one TodoList to another TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to move Todo from one TodoList to another TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move Todo from one TodoList to another TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject moving Todo from one TodoList to another TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Move Todo from one TodoList to another TodoList
```mermaid
---
title: Change position Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move Todo from one TodoList to another TodoList
    frontend->>frontend: Handle reposition of Todo in target TodoList
    frontend->>frontend: Handle repositioning of Todos in source TodoList
    frontend->>backend: Call API to update Todos in source and target TodoLists
    backend->>appwrite: Update Todos
    appwrite->>backend: Reject Todo updates
    backend->>frontend: Reject Todo updates
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```