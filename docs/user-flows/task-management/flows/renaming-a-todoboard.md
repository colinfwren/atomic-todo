# Renaming a TodoBoard

## Happy Path Flows

### Authenticated user renames TodoBoard
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user renames TodoBoard
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Rename TodoBoard
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Rename TodoBoard
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Rename TodoBoard
```mermaid
---
title: Rename TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Rename TodoBoard
    frontend->>backend: Call API to rename TodoBoard
    backend->>appwrite: Update TodoBoard
    appwrite->>backend: Confirm TodoBoard updated
    backend->>frontend: Confirm TodoBoard updated
    frontend-->>user: Update TodoBoard with new TodoBoard data
```
## Alternate Path Flows
### User with timed-out session attempts to rename TodoBoard
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to rename TodoBoard
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Rename TodoBoard
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject renaming TodoBoard
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

    user-->>frontend: Rename TodoBoard
    frontend->>backend: Call API to rename TodoBoard
    backend->>appwrite: Update TodoBoard
    appwrite->>backend: Reject update of TodoBoard
    backend->>frontend: Reject update of TodoBoard
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```