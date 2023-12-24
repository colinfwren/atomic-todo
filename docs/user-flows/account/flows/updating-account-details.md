# Deleting an account

## Happy Path Flows

### User with an account updates password for their account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account updates password for their account
---
stateDiagram-v2
    direction LR
    [*] --> AccountSettings: Update password
    AccountSettings --> [*]

    state AccountSettings {
        accountSettings1: Fill out password update form
        accountSettings2: Update password

        [*] --> accountSettings1
        accountSettings1 --> accountSettings2
    }

 
```

#### Sequence Diagrams
##### Update password
```mermaid
---
title: Update password
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Update password
    frontend->>frontend: Validate passwords meet rules
    frontend->>backend: Call API to update user's password
    backend->>appwrite: Update password for user's account
    appwrite->>backend: Confirm user's password was updated
    backend->>frontend: Confirm user's password was updated
    frontend-->>user: Display message confirming password was updated
```

### User with an account updates email address for their account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account updates password for their account
---
stateDiagram-v2
    direction LR
    [*] --> AccountSettings: Update email address
    AccountSettings --> [*]

    state AccountSettings {
        accountSettings1: Fill out password update form
        accountSettings2: Update email address

        [*] --> accountSettings1
        accountSettings1 --> accountSettings2
    }

 
```

#### Sequence Diagrams
##### Update email address
```mermaid
---
title: Update email address
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Update email address
    frontend->>frontend: Validate email address update form
    frontend->>backend: Call API to update user's email address
    backend->>appwrite: Update email address for user's account
    appwrite->>backend: Confirm user's email address was updated
    backend->>frontend: Confirm user's email address was updated
    frontend-->>user: Display message confirming email address was updated
```
