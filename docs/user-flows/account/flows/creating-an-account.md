# Creating an account

## Happy Path Flows

### User without an account creates an account
Persona: [User without an account](../personas/user-without-an-account.md)

#### Flow
```mermaid
---
title: User without an account creates an account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage: Sign up for account
    Homepage --> Dashboard: Start onboarding
    Dashboard --> TodoBoard: Complete onboarding
    TodoBoard --> [*]

    state Homepage {
        homepage1: Open Sign up form
        homepage2: Fill out account details
        homepage3: Submit sign up form

        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
    }

    state Dashboard {
        dashboard1: Learn how to create a TodoBoard
        
        [*] --> dashboard1
    }

    state TodoBoard {
        todoboard1: Learn to create a Todo
        todoboard2: Learn how to move a Todo between TodoLists of a different granularity
        todoboard3: Learn how to move the Todoboard date forward a week
        todoboard4: Learn how to move the TodoBoard date back a week
        todoboard5: Learn how to hide a Todo in a granularity
        todoboard6: Learn how to delete a Todo

        [*] --> todoboard1
        todoboard1 --> todoboard2
        todoboard2 --> todoboard3
        todoboard3 --> todoboard4
        todoboard4 --> todoboard5
        todoboard5 --> todoboard6
    }
```

#### Sequence Diagrams
##### Sign up for account
```mermaid
---
title: Sign up for account
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open sign up form
    user-->>frontend: fill out account details
    frontend->>frontend: Validate sign in form
    user-->>frontend: Submit sign up form
    frontend->>frontend: Validate sign in form
    frontend->>backend: Call API to create account
    backend->>appwrite: Check account can be created
    appwrite->>appwrite: Create account
    appwrite->>backend: Authenticate user
    backend->>frontend: Authenticated user
    frontend-->>user: Redirect user to dashboard
```

##### Start Onboarding
```mermaid
---
title: Learn how to create a TodoBoard
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Follow onboarding prompt to create a TodoBoard
    frontend->>backend: Call API to create a TodoBoard
    backend->>appwrite: Create TodoBoard
    appwrite->>backend: Confirm TodoBoard created
    backend->>frontend: Confirm TodoBoard created
    frontend-->>user: Redirect to TodoBoard
    frontend->>backend: Call API to get TodoBoard Data
    backend->>appwrite: Get TodoBoard Data
    appwrite->>backend: Get TodoBoard Data
    backend->>frontend: Get TodoBoard Data
    frontend-->>user: Display TodoBoard Data
```

##### Complete Onboarding
```mermaid
---
title: Complete onboarding
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Follow onboarding prompt to create a Todo
    frontend->>backend: Call API to create a Todo
    backend->>appwrite: Create Todo
    appwrite->>backend: Confirm Todo created
    backend->>frontend: Confirm Todo created
    frontend-->>user: Display updated TodoBoard

    user-->>frontend: Follow onboarding prompt to move Todo from one TodoList to another
    frontend->>frontend: Handle move of Todo from one TodoList to another
    frontend->>backend: Call API to Update Todo with new TodoList's start and end date
    backend->>appwrite: Update Todo
    appwrite->>backend: Confirm Todo Updated
    backend->>frontend: Confirm Todo Updated
    frontend-->>user: Display updated TodoBoard

    user-->>frontend: Follow onboarding prompt to move TodoBoard date forward a week
    frontend->>backend: Call API to move TodoBoard date forward a week
    backend->>appwrite: Update TodoBoard with new date
    appwrite->>backend: Confirm TodoBoard updated
    backend->>frontend: Confirm TodoBoard updated
    frontend-->>user: Display updated TodoBoard

    user-->>frontend: Follow onboarding prompt to move TodoBoard date back a week
    frontend->>backend: Call API to move TodoBoard date back a week
    backend->>appwrite: Update TodoBoard with new date
    appwrite->>backend: Confirm TodoBoard updated
    backend->>frontend: Confirm TodoBoard updated
    frontend-->>user: Display updated TodoBoard

    user-->>frontend: Follow onboarding prompt to hide Todo at a granularity
    frontend->>backend: Call API to update Todo
    backend->>appwrite: Update Todo
    appwrite->>backend: Confirm Todo Updated
    backend->>frontend: Confirm Todo Updated
    frontend-->>user: Display updated TodoBoard

    user-->>frontend: Follow onboarding prompt to delete todo
    frontend->>backend: Call API to delete Todo
    backend->>appwrite: Delete Todo
    appwrite->>backend: Confirm Todo deleted
    backend->>frontend: Confirm Todo deleted
    frontend-->>user: Display updated TodoBoard
```

## Alternate Path Flows

### User with an account attempts to create an account
Persona: [User with an account](../personas/user-with-an-account.md)

#### Flow
```mermaid
---
title: User with an account attempts to create an account
---
stateDiagram-v2
    direction LR
    [*] --> Homepage: Sign up for account

    state Homepage {
        homepage1: Open Sign up form
        homepage2: Fill out account details
        homepage3: Submit sign up form

        [*] --> homepage1
        homepage1 --> homepage2
        homepage2 --> homepage3
        homepage3 --> [*]
    }
```
#### Sequence Diagrams
##### Sign up for account
```mermaid
---
title: Sign up for account
---
sequenceDiagram
    actor user
    participant frontend
    participant backend
    participant appwrite

    user-->>frontend: Open sign up form
    user-->>frontend: fill out account details
    frontend->>frontend: Validate sign in form
    user-->>frontend: Submit sign up form
    frontend->>frontend: Validate sign in form
    frontend->>backend: Call API to create account
    backend->>appwrite: Check account can be created
    appwrite->>backend: Reject account creation
    backend->>frontend: Reject account creation
    frontend-->>user: Display error message
```