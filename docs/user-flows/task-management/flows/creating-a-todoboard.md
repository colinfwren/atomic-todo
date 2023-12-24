# Creating a TodoBoard

## Happy Path Flows

### Authenticated user creates a TodoBoard
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user creates a TodoBoard
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Create new TodoBoard
    Dashboard --> TodoBoard
    TodoBoard --> [*]

    state Dashboard {
        dashboard1: Create new TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Create new TodoBoard
```mermaid
---
title: Create new TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Create new TodoBoard
    frontend->>backend: Call API to create new TodoBoard
    backend->>appwrite: Create new TodoBoard
    appwrite->>backend: Confirm TodoBoard created
    backend->>frontend: Confirm TodoBoard created
    frontend-->>user: Redirect user to newly created TodoBoard
```
## Alternate Path Flows
### User with timed-out session attempts to create a TodoBoard
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to create a TodoBoard
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Create new TodoBoard
    Dashboard --> Homepage
    Homepage --> [*]

    state Dashboard {
        dashboard1: Reject creating new TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Create new TodoBoard
```mermaid
---
title: Create new TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Create new TodoBoard
    frontend->>backend: Call API to create new TodoBoard
    backend->>appwrite: Create new TodoBoard
    appwrite->>backend: Reject creating new TodoBoard
    backend->>frontend: Reject creating new TodoBoard
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```