# Deleting a todo

## Happy Path Flows

### Authenticated user deletes Todo from TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user deletes Todo from TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Delete Todo in TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Delete Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Delete Todo in TodoList
```mermaid
---
title: Delete Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Delete Todo in TodoList
    frontend->>backend: Call API to delete Todo
    backend->>appwrite: Delete Todo
    appwrite->>backend: Confirm Todo deleted
    backend->>frontend: Confirm Todo deleted
    frontend-->>user: Update TodoBoard with new TodoBoard data
```
## Alternate Path Flows
### User with timed-out session attempts to delete Todo from TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to delete Todo from TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Delete Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject deleting Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Delete Todo in TodoList
```mermaid
---
title: Delete Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Delete Todo in TodoList
    frontend->>backend: Call API to delete Todo
    backend->>appwrite: Delete Todo
    appwrite->>backend: Reject deletion of Todo
    backend->>frontend: Reject deletion of Todo
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```