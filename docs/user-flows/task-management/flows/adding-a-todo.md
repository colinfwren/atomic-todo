# Adding a todo

## Happy Path Flows

### Authenticated user creates a new Todo in TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user creates a new Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Create new Todo in TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Create new Todo in TodoList
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

    user-->>frontend: Create new Todo in TodoList
    frontend->>backend: Call API to create new Todo
    backend->>appwrite: Create new Todo
    appwrite->>backend: Confirm Todo created
    backend->>frontend: Confirm Todo created
    frontend-->>user: Update TodoBoard with new TodoBoard data
```
## Alternate Path Flows
### User with timed-out session attempts to create a Todo in TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title:  User with timed-out session attempts to create a Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Create new Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject creating new Todo in TodoList
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

    user-->>frontend: Create new Todo in TodoList
    frontend->>backend: Call API to create new Todo
    backend->>appwrite: Create new Todo
    appwrite->>backend: Reject creation of Todo
    backend->>frontend: Reject creation of Todo
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```