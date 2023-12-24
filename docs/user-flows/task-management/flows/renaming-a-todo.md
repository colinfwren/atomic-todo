# Renaming a todo

## Happy Path Flows

### Authenticated user renames Todo in TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user renames Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Rename Todo in TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Rename Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Rename Todo in TodoList
```mermaid
---
title: Rename Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Rename Todo in TodoList
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Confirm Todo updated
    backend->>frontend: Confirm Todo updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```
## Alternate Path Flows
### User with timed-out session attempts to rename Todo in TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to rename Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Rename Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject renaming Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Rename Todo in TodoList
```mermaid
---
title:Rename Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Rename Todo in TodoList
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Reject Todo update
    backend->>frontend: Reject Todo update
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```