# Changing TodoBoard dates

## Happy Path Flows

### Authenticated user moves TodoBoard date forward by a week
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user moves TodoBoard date forward by a week
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move TodoBoard dates forward a week
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Move TodoBoard dates forward a week
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Move TodoBoard dates forward a week
```mermaid
---
title: Move TodoBoard dates forward a week
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move TodoBoard dates forward a week
    frontend->>backend: Call API to move TodoBoard forward a week
    backend->>appwrite: Update TodoBoard dates
    appwrite->>backend: Confirm TodoBoard dates updated
    backend->>frontend: Confirm TodoBoard dates updated
    frontend-->>user: Update TodoBoard data
```

### Authenticated user moves TodoBoard date backward by a week
Persona: [Authenticated user](../personas/authenticated-user.md)

#### Flow
```mermaid
---
title: Authenticated user moves TodoBoard date backward by a week
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move TodoBoard dates back a week
    TodoBoard --> [*]

    state TodoBoard {
        todoboard1: Move TodoBoard dates back a week
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Move TodoBoard dates back a week
```mermaid
---
title: Move TodoBoard dates back a week
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move TodoBoard dates back a week
    frontend->>backend: Call API to move TodoBoard back a week
    backend->>appwrite: Update TodoBoard dates
    appwrite->>backend: Confirm TodoBoard dates updated
    backend->>frontend: Confirm TodoBoard dates updated
    frontend-->>user: Update TodoBoard data
```

## Alternate Path Flows
### User with timed-out session attempts to move TodoBoard date forward by a week
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to move TodoBoard date forward by a week
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move TodoBoard dates forward a week
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject moving TodoBoard dates forward a week
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Reject moving TodoBoard dates forward a week
```mermaid
---
title: Reject moving TodoBoard dates forward a week
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move TodoBoard dates forward a week
    frontend->>backend: Call API to move TodoBoard forward a week
    backend->>appwrite: Update TodoBoard dates
    appwrite->>backend: Reject update of TodoBoard
    backend->>frontend: Reject update of TodoBoard
    frontend-->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```

### User with timed-out session attempts to move TodoBoard date backward by a week
Persona: [User with timed-out session](../personas/user-with-timed-out-session.md)

#### Flow
```mermaid
---
title: User with timed-out session attempts to move TodoBoard date backward by a week
---
stateDiagram-v2
    direction LR
    [*] --> TodoBoard: Move TodoBoard dates back a week
    TodoBoard --> Homepage
    Homepage --> [*]

    state TodoBoard {
        todoboard1: Reject moving TodoBoard dates back a week
        [*] --> todoboard1
    }

 
```

#### Sequence Diagrams
##### Reject moving TodoBoard dates back a week
```mermaid
---
title: Reject moving TodoBoard dates back a week
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Move TodoBoard dates back a week
    frontend->>backend: Call API to move TodoBoard back a week
    backend->>appwrite: Update TodoBoard dates
    appwrite->>backend: Reject update of TodoBoard
    backend->>frontend: Reject update of TodoBoard
    frontend->>frontend: Redirect user to login form
    frontend-->>user: Show user message telling them their session expired
```