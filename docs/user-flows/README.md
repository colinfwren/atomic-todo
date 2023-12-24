# User Flows

## Account
### ✅ Happy Path
- [User without an account creates an account](account/flows/creating-an-account.md#user-without-account-creates-an-account)
- [User with an account logs into account](account/flows/logging-in.md#user-with-an-account-logs-into-account)
- [User with an account deletes their account](account/flows/deleting-an-account.md#user-with-an-account-deletes-their-account)
- [User with an account resets password for their account](account/flows/resetting-account-password.md#user-with-an-account-resets-password-for-their-account)
- [User with an account updates password for their account](account/flows/updating-account-details.md#user-with-an-account-updates-password-for-their-account)
- [User with an account updates email address for their account](account/flows/updating-account-details.md#user-with-an-account-updates-email-address-for-their-account)

### ⁉️ Alternate Path
- [User with an account attempts to create an account](account/flows/creating-an-account.md#user-with-an-account-attempts-to-create-an-account)
- [User without an account attempts to log into account](account/flows/logging-in.md#user-without-an-account-attempts-to-log-into-account)
- [User without an account resets password for account](account/flows/resetting-account-password.md#user-without-an-account-resets-password-for-account)

### 👤 Personas
- [User with an account](account/personas/user-with-an-account.md)
- [User without an account](account/personas/user-without-an-account.md)

## Task Management
### ✅ Happy Path
- [Authenticated user creates a TodoBoard](task-management/flows/creating-a-todoboard.md#authenticated-user-creates-a-todoboard)
- [Authenticated user views a TodoBoard that belongs to them](task-management/flows/viewing-a-todoboard.md#authenticated-user-views-a-todoboard-that-belongs-to-them)
- [Authenticated user deletes a TodoBoard that belongs to them](task-management/flows/deleting-a-todoboard.md#authenticated-user-deletes-a-todoboard-that-belongs-to-them)
- [Authenticated user creates a new Todo in TodoList](task-management/flows/adding-a-todo.md#authenticated-user-creates-a-new-todo-in-todolist)
- [Authenticated user deletes Todo from TodoList](task-management/flows/deleting-a-todo.md#authenticated-user-deletes-todo-from-todolist)
- [Authenticated user renames Todo in TodoList](task-management/flows/renaming-a-todo.md#authenticated-user-renames-todo-in-todolist)
- [Authenticated user completes Todo in TodoList](task-management/flows/completing-a-todo.md#authenticated-user-completes-todo-in-todolist)
- [Authenticated user changes position of Todo in TodoList](task-management/flows/moving-a-todo.md#authenticated-user-changes-position-of-todo-in-todolist)
- [Authenticated user moves Todo from one TodoList to another TodoList](task-management/flows/moving-a-todo.md#authenticated-user-moves-todo-from-one-todolist-to-another-todolist)
- [Authenticated user renames TodoBoard](task-management/flows/renaming-a-todoboard.md#authenticated-user-renames-todoboard)
- [Authenticated user moves TodoBoard date forward by a week](task-management/flows/changing-todoboard-dates.md#authenticated-user-moves-todoboard-date-forward-by-a-week)
- [Authenticated user moves TodoBoard date backward by a week](task-management/flows/changing-todoboard-dates.md#authenticated-user-moves-todoboard-date-backward-by-a-week)
- [Authenticated user changes visibility of Todo in TodoList granularity](task-management/flows/changing-todo-visibility.md#authenticated-user-changes-visibilty-of-todo-in-todolist-granularity)

### ⁉️ Alternate Path
- [User with timed-out session attempts to create a TodoBoard](task-management/flows/creating-a-todoboard.md#user-with-timed-out-session-attempts-to-create-a-todoboard)
- [Authenticated user attempts to view a TodoBoard that doesn't belong to them](task-management/flows/viewing-a-todoboard.md#authenticated-user-attempts-to-view-a-todoboard-that-doesnt-belong-to-them)
- [User with timed-out session attempts to view a TodoBoard that belongs to them](task-management/flows/viewing-a-todoboard.md#user-with-timed-out-session-attempts-to-view-a-todoboard-that-belongs-to-them)
- [Unauthenticated user attempts to view a TodoBoard](task-management/flows/viewing-a-todoboard.md#unauthenticated-user-attempts-to-view-a-todoboard)
- [Authenticated user attempts to delete a TodoBoard that doesn't belong to them](task-management/flows/deleting-a-todoboard.md#authenticated-user-attempts-to-delete-a-todoboard-that-doesnt-belong-to-them)
- [User with timed-out session attempts to delete a TodoBoard that belongs to them](task-management/flows/deleting-a-todoboard.md#user-with-timed-out-sesssion-attempts-to-delete-a-todoboard-that-belongs-to-them)
- [User with timed-out session attempts to create a new Todo in TodoList](task-management/flows/adding-a-todo.md#user-with-timed-out-session-attempts-to-create-a-new-todo-in-todolist)
- [User with timed-out session attempts to delete Todo from TodoList](task-management/flows/deleting-a-todo.md#user-with-timed-out-session-attempts-to-delete-todo-from-todolist)
- [User with timed-out session attempts to rename Todo in TodoList](task-management/flows/renaming-a-todo.md#user-with-timed-out-session-attempts-to-rename-todo-in-todolist)
- [User with timed-out session attempts to complete Todo in TodoList](task-management/flows/completing-a-todo.md#user-with-timed-out-session-attempts-to-complete-todo-in-todolist)
- [User with timed-out session attempts to change position of Todo in TodoList](task-management/flows/moving-a-todo.md#user-with-timed-out-session-attempts-to-change-position-of-todo-in-todolist)
- [User with timed-out session attempts to move Todo from one TodoList to another TodoList](task-management/flows/moving-a-todo.md#user-with-timed-out-session-attempts-to-move-todo-from-one-todolist-to-another-todolist)
- [User with timed-out session attempts to rename TodoBoard](task-management/flows/renaming-a-todoboard.md#user-with-timed-out-session-attempts-to-rename-todboard)
- [User with timed-out session attempts to move TodoBoard date forward by a week](task-management/flows/changing-todoboard-dates.md#user-with-timed-out-session-attempts-to-move-todoboard-date-forward-by-a-week)
- [User with timed-out session attempts to move TodoBoard date backward by a week](task-management/flows/changing-todoboard-dates.md#user-with-timed-out-session-attempts-to-move-todoboard-date-backward-by-a-week)
- [User with timed-out session attempts to change visibility of Todo in TodoList granularity](task-management/flows/changing-todo-visibility.md#user-with-timed-out-session-attempts-to-change-visibility-of-todo-in-todolist-granularity)

### 👤 Personas
- [Authenticated user](task-management/personas/authenticated-user.md)
- [Unauthenticated user](task-management/personas/unauthenticated-user.md)
- [User with timed-out session](task-management/personas/user-with-timed-out-session.md)