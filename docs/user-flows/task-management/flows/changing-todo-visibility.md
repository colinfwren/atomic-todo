# Changing Todo visbility

## Happy Path Flows

### Authenticated user changes visibility of Todo in TodoList granularity
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user changes visibility of Todo in TodoList granularity
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Change visibility of Todo in TodoList granularity
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Change visibility of Todo in TodoList granularity
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Change visibility of Todo in TodoList granularity
```mermaid
---
title: Change visibility of Todo in TodoList granularity
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Change visibility of Todo in TodoList granularity
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Confirm Todo updated
    backend->>frontend: Confirm Todo updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```

## Alternate Path Flows
### User with timed-out session attempts to change visibility of Todo in TodoList granularity
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to change visibility of Todo in TodoList granularity
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Create new Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject changing visibility of Todo in TodoList granularity
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Create new Todo in TodoList
```mermaid
---
title: Create new Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Change visibility of Todo in TodoList granularity
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Reject Todo update
    backend->>frontend: Reject Todo update
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```