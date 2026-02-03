---
id: 0001
title: Backend task CRUD spec
stage: spec
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-tasks-crud
branch: 001-ai-book-constitution
user: unknown
command: /sp.specify
labels: ["spec","backend","tasks","crud","jwt","security"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-tasks-crud/spec.md
 - specs/001-tasks-crud/checklists/requirements.md
tests:
 - none
---

## Prompt

```text
Todo App – Spec-1: Backend Core & Data Layer

Target audience:
- Claude Code agent
- Backend reviewers

Focus:
- Secure REST API
- Persistent task storage
- User-scoped data access

Success criteria:
- All task CRUD endpoints work
- JWT required on every request
- Users only access their own tasks
- Data persists in Neon PostgreSQL

Requirements:
- FastAPI backend
- SQLModel ORM
- JWT verification using BETTER_AUTH_SECRET
- Enforce token user_id == URL user_id
- Filter all DB queries by authenticated user

Endpoints:
- GET /api/{user_id}/tasks
- POST /api/{user_id}/tasks
- GET /api/{user_id}/tasks/{id}
- PUT /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH /api/{user_id}/tasks/{id}/complete

Data model:
- Task: id, title, description, completed, created_at, updated_at, user_id

Errors:
- 401: missing/invalid token
- 403: user mismatch
- 404: task not found
- 422: invalid input

Constraints:
- Backend only (no frontend)
- Stateless JWT auth
- JSON API only

Not building:
- Auth UI
- Token issuing
- Frontend logic
```

## Response snapshot

- Created feature spec at `specs/001-tasks-crud/spec.md` covering user-scoped task CRUD behavior.
- Included prioritized user stories (P1 list/create, P2 read/update, P3 complete/delete), acceptance scenarios, edge cases, and an explicit error taxonomy (401/403/404/422).
- Created spec quality checklist at `specs/001-tasks-crud/checklists/requirements.md` and marked items passing based on spec contents.

## Outcome

- ✅ Impact: A reviewable, testable feature spec exists for backend-only task CRUD with strict user scoping.
- 🧪 Tests: none (specification artifact)
- 📁 Files: new spec + checklist
- 🔁 Next prompts: Run `/sp.plan` for `001-tasks-crud` to design backend structure, contracts, and data model details.
- 🧠 Reflection: Repo is not set up as a clean project-level git repo; specs were written under Phase-II per user preference.

## Evaluation notes (flywheel)

- Failure modes observed: `/sp.specify` automation script could not be used due to repo layout (git root at home, no origin remote).
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Initialize git repo inside Phase-II and rerun full `/sp.specify` workflow using create-new-feature.ps1.
