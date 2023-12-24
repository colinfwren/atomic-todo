# Deleting an account

## Happy Path Flows

### User with an account deletes their account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account deletes their account
---
stateDiagram-v2
    direction LR
    [*] --> AccountSettings: Delete account
    AccountSettings --> Homepage
    Homepage --> [*]

    state AccountSettings {
        accountSettings1: Delete account

        [*] --> accountSettings1
    }

 
```

#### Sequence Diagrams
##### Delete Account
```mermaid
---
title: Delete Account
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Ask user to confirm they want to delete their account
    frontend->>backend: Call API to delete user's account
    backend->>appwrite: Delete user's account and de-authenticate them
    appwrite->>backend: Confirm account deletion
    backend->>frontend: Confirm account deletion
    frontend-->>user: Redirect user to Homepage
```
