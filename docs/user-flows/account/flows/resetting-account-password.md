# Deleting an account

## Happy Path Flows

### User with an account resets password for their account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account resets password for their account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage1: Reset Password
    Homepage1 --> EmailClient
    EmailClient --> SetPasswordPage
    SetPasswordPage --> Homepage2
    Homepage2 --> [*]

    state Homepage1 {
        homepage1: Open login form
        homepage2: Open password reset form
        homepage3: Submit password reset form
        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
    }
    
    state EmailClient {
        emailclient1: Open password set one-time link
        [*] --> emailclient1
    }

    state SetPasswordPage {
        setpasswordpage1: Fill out set password form
        setpasswordpage2: Submit set password form
        
        [*] --> setpasswordpage1
        setpasswordpage1 --> setpasswordpage2
    }
```

#### Sequence Diagrams
##### Reset Password
```mermaid
---
title: Reset Password
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open login form
    user-->>frontend: Open password reset form
    frontend->>frontend: Validate password reset form
    user-->>frontend: Submit password reset form
    frontend->>frontend: Validate password reset form
    frontend->>backend: Call API to reset password for account
    backend->>appwrite: Initiate password reset process
    appwrite->>backend: Confirm password reset process started
    backend->>frontend: Confirm password reset process started
    frontend-->>user: Redirect user to login form
    frontend-->>user: Show password reset initiated message
```

```mermaid
---
title: Set new password
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Fill out set password form
    frontend->>frontend: Validate set password form
    user-->>frontend: Submit set password form
    frontend->>frontend: Validate set password form
    frontend->>backend: Call API to set password
    backend->>appwrite: Update password for user's account
    appwrite->>backend: Confirm password was set
    backend->>frontend: Confirm password was set
    frontend-->>user: Redirect user to login form
```

## Alternate Path Flows

### User without an account attempts to reset password for account
Persona: [User without an account](../personas/user-without-an-account.md)

#### Flow
```mermaid
---
title: User without an account attempts to reset password for account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage1: Reset Password
    Homepage1 --> EmailClient
    EmailClient --> [*]

    state Homepage1 {
        homepage1: Open login form
        homepage2: Open password reset form
        homepage3: Submit password reset form
        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
    }
```

#### Sequence Diagrams
##### Reset Password
```mermaid
---
title: Reset Password
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open login form
    user-->>frontend: Open password reset form
    frontend->>frontend: Validate password reset form
    user-->>frontend: Submit password reset form
    frontend->>frontend: Validate password reset form
    frontend->>backend: Call API to reset password for account
    backend->>appwrite: Initiate password reset process
    appwrite->>backend: Confirm password reset process started
    backend->>frontend: Confirm password reset process started
    frontend-->>user: Redirect user to login form
    frontend-->>user: Show password reset initiated message
```