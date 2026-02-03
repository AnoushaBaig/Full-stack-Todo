---

description: "Tasks for 001-tasks-crud implementation"
---

# Tasks: 001-tasks-crud

**Input**: Design documents from `/specs/001-tasks-crud/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Included (plan Phase 2 step 10 explicitly requests basic integration tests)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing
of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` for backend code, `backend/tests/` for tests

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend skeleton per plan in `backend/app/` and `backend/tests/` (create `backend/app/main.py`)
- [x] T002 [P] Add Python project config in `backend/pyproject.toml` with FastAPI, SQLModel, and test deps
- [x] T003 [P] Add formatting/lint config in `backend/pyproject.toml` (ruff) and `backend/.ruff.toml` (if used)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create env config loader in `backend/app/core/config.py` for `DATABASE_URL` and `BETTER_AUTH_SECRET`
- [x] T005 Create DB engine + session dependency in `backend/app/db/session.py`
- [x] T006 Create SQLModel base models module in `backend/app/db/models.py` and add Task model scaffold
- [x] T007 [P] Add JWT auth dependency scaffold in `backend/app/core/security.py` (parse Authorization header)
- [x] T008 Add shared error response helpers in `backend/app/core/errors.py` matching `specs/001-tasks-crud/contracts/errors.md`
- [x] T009 Wire FastAPI app + router structure in `backend/app/main.py` (include `backend/app/api/routes/tasks.py`)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - List and create my tasks (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can list only their own tasks and create new tasks.

**Independent Test**:
- With JWT for user A, POST a task then GET list and confirm it appears.
- With JWT for user B, GET user A list must not return user A tasks.

### Tests for User Story 1 (required)

- [x] T010 [P] [US1] Add integration test for list/create in `backend/tests/integration/test_tasks_list_create.py`

### Implementation for User Story 1

- [x] T011 [US1] Implement Task SQLModel fields in `backend/app/db/models.py` (title validation, timestamps, user_id)
- [x] T012 [P] [US1] Add request/response schemas in `backend/app/api/schemas/tasks.py`
- [x] T013 [US1] Implement auth extraction (token_user_id from JWT) in `backend/app/core/security.py`
- [x] T014 [US1] Implement GET `/api/{user_id}/tasks` in `backend/app/api/routes/tasks.py` (filter by user_id)
- [x] T015 [US1] Implement POST `/api/{user_id}/tasks` in `backend/app/api/routes/tasks.py` (create task owned by auth user)

**Checkpoint**: User Story 1 functional and independently testable

---

## Phase 4: User Story 2 - View and edit one of my tasks (Priority: P2)

**Goal**: Authenticated users can read and update a task they own.

**Independent Test**:
- Create a task, GET by id, PUT update title/description, then GET again and verify updated values.

### Tests for User Story 2 (required)

- [x] T016 [P] [US2] Add integration test for read/update in `backend/tests/integration/test_tasks_read_update.py`

### Implementation for User Story 2

- [x] T017 [US2] Implement GET `/api/{user_id}/tasks/{id}` in `backend/app/api/routes/tasks.py` (scope by id+user_id)
- [x] T018 [US2] Implement PUT `/api/{user_id}/tasks/{id}` in `backend/app/api/routes/tasks.py` (scope by id+user_id)
- [x] T019 [US2] Ensure 404 behavior for non-existent task ids in `backend/app/api/routes/tasks.py`

**Checkpoint**: User Story 2 functional and independently testable

---

## Phase 5: User Story 3 - Complete and delete one of my tasks (Priority: P3)

**Goal**: Authenticated users can mark tasks complete and delete tasks they own.

**Independent Test**:
- Create a task, PATCH complete, verify completed=true, DELETE, verify subsequent GET is 404.

### Tests for User Story 3 (required)

- [x] T020 [P] [US3] Add integration test for complete/delete in `backend/tests/integration/test_tasks_complete_delete.py`

### Implementation for User Story 3

- [x] T021 [US3] Implement PATCH `/api/{user_id}/tasks/{id}/complete` in `backend/app/api/routes/tasks.py`
- [x] T022 [US3] Implement DELETE `/api/{user_id}/tasks/{id}` in `backend/app/api/routes/tasks.py`
- [x] T023 [US3] Enforce cross-user behavior returns 404 (id+user_id filtering) across all handlers in `backend/app/api/routes/tasks.py`

**Checkpoint**: All user stories independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting improvements

- [x] T024 [P] Add quickstart validation notes in `specs/001-tasks-crud/quickstart.md` based on actual run commands
- [x] T025 Add consistent error codes/messages across endpoints per `specs/001-tasks-crud/contracts/errors.md` in `backend/app/core/errors.py`
- [x] T026 [P] Add minimal API docs note in `specs/001-tasks-crud/contracts/http-api.md` if implementation deviates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion; should be done in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: After desired stories complete

### User Story Dependencies

- **US1 (P1)**: Requires Phase 1–2
- **US2 (P2)**: Requires US1 to be meaningful (needs a task to exist), but can reuse the same foundations
- **US3 (P3)**: Requires US1 to be meaningful

### Parallel Opportunities

- Phase 1 tasks T002 and T003 are parallelizable.
- Integration tests (T010, T016, T020) are parallelizable relative to each other, but depend on foundational + relevant routes.
- Schema file and security helpers can be developed in parallel when in separate files.

---

## Parallel Example: User Story 1

```text
Parallel tasks after Phase 2:
- T010 [P] [US1] Add integration test in backend/tests/integration/test_tasks_list_create.py
- T012 [P] [US1] Add schemas in backend/app/api/schemas/tasks.py
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1)
4. STOP and validate US1 using `specs/001-tasks-crud/quickstart.md`

### Incremental Delivery

1. Add US1 → validate
2. Add US2 → validate
3. Add US3 → validate
