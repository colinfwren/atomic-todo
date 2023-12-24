# Logging in

## Happy Path Flows

### User with an account logs into account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account logs into account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage: Log into account
    Homepage --> Dashboard
    Dashboard --> [*]

   state Homepage {
        homepage1: Open login form
        homepage2: Fill out account details
        homepage3: Submit login form
        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
    }

 
```

#### Sequence Diagrams
##### Log into account
```mermaid
---
title: Log into account
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open login form
    user-->>frontend: Fill out account details
    frontend->>frontend: Validate login form
    user-->>frontend: Submit login form
    frontend->>frontend: Validate login form
    frontend->>backend: Call API to authenticate user
    backend->>appwrite: Authenticate user
    appwrite->>backend: Authenticate user
    backend->>frontend: Authenticate user
    frontend-->>user: Redirect user to Dashboard
```

## Alternate Path Flows

### User without an account attempts to log into account
Persona: [User without an account](../personas/user-without-an-account.md)

#### Flow
```mermaid
---
title: User without an account attempts to log into account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage: Log into account
    Homepage --> [*]

    state Homepage {
        homepage1: Open login form
        homepage2: Fill out account details
        homepage3: Submit login form
        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
    }

 
```

#### Sequence Diagrams
##### Log into account
```mermaid
---
title: Log into account
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open login form
    user-->>frontend: Fill out account details
    frontend->>frontend: Validate login form
    user-->>frontend: Submit login form
    frontend->>frontend: Validate login form
    frontend->>backend: Call API to authenticate user
    backend->>appwrite: Authenticate user
    appwrite->>backend: Reject authentication
    backend->>frontend: Reject authentication
    frontend-->>user: Display error message
```
