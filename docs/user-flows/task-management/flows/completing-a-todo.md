# Completing a todo

## Happy Path Flows

### Authenticated user completes Todo in TodoList
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user completes Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Complete Todo in TodoList
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Complete Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Complete Todo in TodoList
```mermaid
---
title: Complete Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Complete Todo in TodoList
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Confirm Todo updated
    backend->>frontend: Confirm Todo updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```
## Alternate Path Flows
### User with timed-out session attempts to complete Todo in TodoList
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to complete Todo in TodoList
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Complete Todo in TodoList
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject completing Todo in TodoList
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Complete Todo in TodoList
```mermaid
---
title: Complete Todo in TodoList
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Complete Todo in TodoList
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Reject Todo update
    backend->>frontend: Reject Todo update
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```