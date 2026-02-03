# Feature Specification: Backend task CRUD (user-scoped)

**Feature Branch**: `[001-tasks-crud]`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Todo App – Spec-1: Backend Core & Data Layer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - List and create my tasks (Priority: P1)

As an authenticated user, I want to list my tasks and create new tasks so I can track what I need
to do.

**Why this priority**: This is the smallest useful slice: persistent task storage and retrieval.

**Independent Test**: With a valid JWT for user A, call list (expect only user A tasks), create a
new task, then list again and see it.

**Acceptance Scenarios**:

1. **Given** I have a valid JWT and my user id, **When** I request my task list,
   **Then** I receive only tasks owned by me.
2. **Given** I have a valid JWT and my user id, **When** I create a task with a title,
   **Then** the task is persisted and appears in subsequent list results.
3. **Given** I have no JWT (or an invalid JWT), **When** I request my task list,
   **Then** I receive `401 Unauthorized`.

---

### User Story 2 - View and edit one of my tasks (Priority: P2)

As an authenticated user, I want to view a single task and update its fields so I can keep my
tasks accurate.

**Why this priority**: Editing is core CRUD capability needed after creation.

**Independent Test**: Create a task, fetch it by id, update title/description, fetch again and
verify changes.

**Acceptance Scenarios**:

1. **Given** I have a valid JWT and a task id that I own, **When** I request that task,
   **Then** I receive the task details.
2. **Given** I have a valid JWT and a task id that I own, **When** I update title/description,
   **Then** the updated values are returned and persisted.
3. **Given** I have a valid JWT and a task id that does not exist (for me), **When** I request it,
   **Then** I receive `404 Not Found`.

---

### User Story 3 - Complete and delete one of my tasks (Priority: P3)

As an authenticated user, I want to mark a task as complete and delete tasks I no longer need.

**Why this priority**: Completes the CRUD loop and supports task lifecycle.

**Independent Test**: Create a task, mark it complete, verify completed state, delete it, verify it
no longer appears in list.

**Acceptance Scenarios**:

1. **Given** I have a valid JWT and a task id that I own, **When** I mark the task complete,
   **Then** its completed state becomes true and remains true in future reads.
2. **Given** I have a valid JWT and a task id that I own, **When** I delete the task,
   **Then** it no longer appears in list results and future reads return `404 Not Found`.

---

### Edge Cases

- What happens when the JWT is missing, invalid, or expired? → return `401 Unauthorized`.
- What happens when the token user identity does not match the `{user_id}` path parameter?
  → return `403 Forbidden`.
- What happens when a user attempts to access another user’s task id?
  → MUST NOT return that other user’s data; return `404 Not Found` (treat as not found for this
  user).
- What happens when required fields are missing or invalid (e.g., empty title)? → return
  `422 Unprocessable Entity`.
- What happens when a task id does not exist (for the authenticated user)? → return
  `404 Not Found`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require a valid JWT on every task API request.
- **FR-002**: System MUST derive authenticated user identity only from the validated JWT payload.
- **FR-003**: System MUST enforce that `token.user_id == {user_id}` for all endpoints under
  `/api/{user_id}/tasks`.
- **FR-004**: System MUST scope all reads/writes to tasks by authenticated user ownership (user_id)
  at the data access layer.
- **FR-005**: System MUST allow an authenticated user to list their tasks.
- **FR-006**: System MUST allow an authenticated user to create a task with at least a title.
- **FR-007**: System MUST allow an authenticated user to read a single task they own by id.
- **FR-008**: System MUST allow an authenticated user to update a task they own by id.
- **FR-009**: System MUST allow an authenticated user to delete a task they own by id.
- **FR-010**: System MUST allow an authenticated user to mark a task they own as complete.
- **FR-011**: System MUST persist tasks so they remain available across restarts.
- **FR-012**: System MUST return consistent error responses using this taxonomy:
  - `401` for missing/invalid/expired token
  - `403` for token/path user mismatch
  - `404` for task not found (including attempts to access other users’ tasks)
  - `422` for invalid input

### Key Entities *(include if feature involves data)*

- **Task**: A user-owned record representing a unit of work.
  - Attributes: id, title, description (optional), completed, created_at, updated_at, user_id
  - Ownership: every Task MUST belong to exactly one user (by user_id).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A signed-in user can create a task and see it returned in their task list.
- **SC-002**: A user can complete and delete tasks, and subsequent reads reflect those changes.
- **SC-003**: Unauthorized requests to task endpoints are rejected with `401`.
- **SC-004**: Cross-user task access is prevented: user A can never retrieve any task data owned by
  user B.
