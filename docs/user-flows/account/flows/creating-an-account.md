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
    participant front-end
    participant back-end
    participant appwrite

    user-->>front-end: Open sign up form
    user-->>front-end: fill out account details
    front-end-->>front-end: Validate sign in form
    user-->>front-end: Submit sign up form
    front-end-->>front-end: Validate sign in form
    front-end->>back-end: Call API to create account
    back-end->>appwrite: Check account can be created
    appwrite->>appwrite: Create account
    appwrite-->>back-end: Authenticate user
    back-end-->>front-end: Authenticated user
    front-end->>user: Redirect user to dashboard
```

##### Start Onboarding
```mermaid
---
title: Learn how to create a TodoBoard
---
sequenceDiagram
    actor user
    participant front-end
    participant back-end
    participant appwrite

    user-->>front-end: Follow onboarding prompt to create a TodoBoard
    front-end-->back-end: Call API to create a TodoBoard
    back-end-->appwrite: Create TodoBoard
    appwrite-->back-end: Confirm TodoBoard created
    back-end-->front-end: Confirm TodoBoard created
    front-end-->user: Redirect to TodoBoard
    front-end-->back-end: Call API to get TodoBoard Data
    back-end-->appwrite: Get TodoBoard Data
    appwrite->back-end: Get TodoBoard Data
    back-end-->front-end: Get TodoBoard Data
    front-end-->user: Display TodoBoard Data
```

##### Complete Onboarding
```mermaid
---
title: Complete onboarding
---
sequenceDiagram
    actor user
    participant front-end
    participant back-end
    participant appwrite

    user-->>front-end: Follow onboarding prompt to create a Todo
    front-end-->back-end: Call API to create a Todo
    back-end-->appwrite: Create Todo
    appwrite-->back-end: Confirm Todo created
    back-end-->front-end: Confirm Todo created
    front-end-->user: Display updated TodoBoard

    user-->>front-end: Follow onboarding prompt to move Todo from one TodoList to another
    front-end-->front-end: Handle move of Todo from one TodoList to another
    front-end-->back-end: Call API to Update Todo with new TodoList's start and end date
    back-end-->appwrite: Update Todo
    appwrite-->back-end: Confirm Todo Updated
    back-end-->front-end: Confirm Todo Updated
    front-end-->user: Display updated TodoBoard

    user-->>front-end: Follow onboarding prompt to move TodoBoard date forward a week
    front-end-->back-end: Call API to move TodoBoard date forward a week
    back-end-->appwrite: Update TodoBoard with new date
    appwrite-->back-end: Confirm TodoBoard updated
    back-end-->front-end: Confirm TodoBoard updated
    front-end-->user: Display updated TodoBoard

    user-->>front-end: Follow onboarding prompt to move TodoBoard date back a week
    front-end-->back-end: Call API to move TodoBoard date back a week
    back-end-->appwrite: Update TodoBoard with new date
    appwrite-->back-end: Confirm TodoBoard updated
    back-end-->front-end: Confirm TodoBoard updated
    front-end-->user: Display updated TodoBoard

    user-->>front-end: Follow onboarding prompt to hide Todo at a granularity
    front-end-->back-end: Call API to update Todo
    back-end-->appwrite: Update Todo
    appwrite-->back-end: Confirm Todo Updated
    back-end-->front-end: Confirm Todo Updated
    front-end-->user: Display updated TodoBoard

    user-->>front-end: Follow onboarding prompt to delete todo
    front-end-->back-end: Call API to delete Todo
    back-end-->appwrite: Delete Todo
    appwrite-->back-end: Confirm Todo deleted
    back-end-->front-end: Confirm Todo deleted
    front-end-->user: Display updated TodoBoard
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
    participant front-end
    participant back-end
    participant appwrite

    user-->>front-end: Open sign up form
    user-->>front-end: fill out account details
    front-end-->>front-end: Validate sign in form
    user-->>front-end: Submit sign up form
    front-end-->>front-end: Validate sign in form
    front-end->>back-end: Call API to create account
    back-end->>appwrite: Check account can be created
    appwrite->>back-end: Reject account creation
    back-end-->front-end: Reject account creation
    front-end->>user: Display error message
```