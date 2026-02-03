# task.md
## Spec-2: Backend Auth & Security Integration (JWT)

### Objective
Integrate JWT-based authentication into FastAPI backend and enforce secure, user-scoped access using Neon PostgreSQL.

---

## Phase 1: Backend Security Setup

- [X] T001 Add BETTER_AUTH_SECRET to backend `.env`
- [X] T002 Create JWT verification utility in `backend/app/core/security.py`
- [X] T003 Implement JWT decode + expiry validation
- [X] T004 Extract `user_id` from JWT payload

---

## Phase 2: Database Alignment (Neon)

- [X] T005 Create `users` table model in `backend/app/db/models/user.py`
- [X] T006 Create `tasks` table model in `backend/app/db/models/task.py`
- [X] T007 Add foreign key: `tasks.user_id → users.id`
- [X] T008 Ensure SQLModel relationships are defined

---

## Phase 3: Route Protection

- [X] T009 Add auth dependency to task routes in `backend/app/api/routes/tasks.py`
- [X] T010 Reject requests without JWT (401)
- [X] T011 Reject requests with invalid/expired JWT (401)
- [X] T012 Ensure JWT `user_id` matches task owner (403)

---

## Phase 4: Ownership Enforcement

- [X] T013 Filter all task queries by authenticated `user_id`
- [X] T014 Prevent cross-user task access
- [X] T015 Ensure delete/update only affects owner's tasks

---

## Phase 5: Backend Validation

- [X] T016 Add basic integration tests for JWT auth
- [X] T017 Validate Neon DB persistence
- [X] T018 Confirm stateless auth behavior

---

## Constraints
- Backend only (FastAPI)
- No frontend / Next.js code
- JWT verification only (no issuing)
- Neon PostgreSQL + SQLModel
- Stateless authentication

---

## Completion Criteria
- Backend accepts JWT tokens
- Tasks are strictly user-scoped
- Unauthorized access always rejected
- Users and tasks correctly stored in Neon DB
