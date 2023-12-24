# Viewing a TodoBoard

## Happy Path Flows

### Authenticated user views a TodoBoard that belongs to them
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user views a TodoBoard that belongs to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Open TodoBoard
    Dashboard --> TodoBoard
    TodoBoard --> [*]

    state Dashboard {
        dashboard1: Open TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Open TodoBoard
```mermaid
---
title: Open TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open TodoBoard
    frontend->>frontend: Redirect user to TodoBoard
    frontend->>backend: Call API to load TodoBoard
    backend->>appwrite: Get data for TodoBoard
    appwrite->>backend: Display data for TodoBoard
    backend->>frontend: Display data for TodoBoard
    frontend-->>user: Display data for TodoBoard
```
## Alternate Path Flows
### Authenticated user attempts to view a TodoBoard that doesn't belong to them
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user attempts to view a TodoBoard that doesn't belong to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Open TodoBoard
    Dashboard --> [*]

    state Dashboard {
        dashboard1: Reject opening TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Open TodoBoard
```mermaid
---
title: Open TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open TodoBoard
    frontend->>frontend: Redirect user to TodoBoard
    frontend->>backend: Call API to load TodoBoard
    backend->>appwrite: Get data for TodoBoard
    appwrite->>backend: Reject loading TodoBoard data
    backend->>frontend: Reject loading TodoBoard data
    frontend-->>user: Display error message
```

### User with timed-out session attempts to view a TodoBoard that belongs to them
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to view a TodoBoard that belongs to them
---
stateDiagram-v2
    direction LR
    [*] --> Dashboard: Open TodoBoard
    Dashboard --> Homepage
    Homepage --> [*]

    state Dashboard {
        dashboard1: Reject opening TodoBoard
        [*] --> dashboard1
    }

 
```

#### Sequence Diagrams
##### Open TodoBoard
```mermaid
---
title: Open TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open TodoBoard
    frontend->>frontend: Redirect user to TodoBoard
    frontend->>backend: Call API to load TodoBoard
    backend->>appwrite: Get data for TodoBoard
    appwrite->>backend: Reject loading TodoBoard data
    backend->>frontend: Reject loading TodoBoard data
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```

### Unauthenticated user attempts to view a TodoBoard
Persona: [Unauthenticated user](../personas/unauthenticated-user.md)

#### Flow
```mermaid
---
title: Unauthenticated user attempts to view a TodoBoard
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Open TodoBoard
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject opening TodoBoard
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Open TodoBoard
```mermaid
---
title: Open TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open TodoBoard
    frontend->>backend: Call API to load TodoBoard
    backend->>appwrite: Get data for TodoBoard
    appwrite->>backend: Reject loading TodoBoard data
    backend->>frontend: Reject loading TodoBoard data
    frontend->>user: Redirect user to login form
```