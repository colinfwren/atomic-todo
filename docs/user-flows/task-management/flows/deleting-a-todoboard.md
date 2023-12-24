# Deleting a TodoBoard

## Happy Path Flows

### Authenticated user deletes a TodoBoard that belongs to them
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user deletes a TodoBoard that belongs to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Delete TodoBoard
    Dashboard --> [*]

    state Dashboard {
        dashboard1: Delete TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Delete TodoBoard
```mermaid
---
title: Delete TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Delete TodoBoard
    frontend->>frontend: Confirm that user wants to delete TodoBoard
    frontend->>backend: Call API to delete TodoBoard
    backend->>appwrite: Delete TodoBoard
    appwrite->>backend: Confirm TodoBoard deleted
    backend->>frontend: Confirm TodoBoard deleted
    frontend-->>user: Update Dashboard data
```
## Alternate Path Flows
### Authenticated user attempts to delete a TodoBoard that doesn't belong to them
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user attempts to delete a TodoBoard that doesn't belong to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Delete TodoBoard
    Dashboard --> [*]

    state Dashboard {
        dashboard1: Reject deleting TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Delete TodoBoard
```mermaid
---
title: Delete TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Delete TodoBoard
    frontend->>frontend: Confirm that user wants to delete TodoBoard
    frontend->>backend: Call API to delete TodoBoard
    backend->>appwrite: Delete TodoBoard
    appwrite->>backend: Reject deleting TodoBoard
    backend->>frontend: Reject deleting TodoBoard
    frontend-->>user: Display error message
```

### User with timed-out session attempts to delete a TodoBoard that belongs to them
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to delete a TodoBoard that belongs to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Delete TodoBoard
    Dashboard --> Homepage
    Homepage --> [*]

    state Dashboard {
        dashboard1: Reject deleting TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Delete TodoBoard
```mermaid
---
title: Delete TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Delete TodoBoard
    frontend->>frontend: Confirm that user wants to delete TodoBoard
    frontend->>backend: Call API to delete TodoBoard
    backend->>appwrite: Delete TodoBoard
    appwrite->>backend: Reject deleting TodoBoard
    backend->>frontend: Reject deleting TodoBoard
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```