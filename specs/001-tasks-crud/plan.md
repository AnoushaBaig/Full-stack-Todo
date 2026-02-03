# Implementation Plan: 001-tasks-crud

**Branch**: `[001-tasks-crud]` | **Date**: 2026-01-08 | **Spec**: `spec.md`
**Input**: Feature specification from `/specs/001-tasks-crud/spec.md`

## Summary

Deliver a backend-only, secure, user-scoped Task CRUD API where every request requires a valid JWT,
all data access is scoped to the authenticated user at the query layer, and responses follow a
consistent error taxonomy (401/403/404/422).

## Technical Context

**Language/Version**: Python 3.12 (target)
**Primary Dependencies**: FastAPI + SQLModel
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (target)
**Target Platform**: Server (Linux container or equivalent)
**Project Type**: web (backend-only in this feature)
**Performance Goals**: Baseline web API responsiveness (p95 < 300ms for CRUD under normal load)
**Constraints**: Stateless backend; JWT required; JSON-only REST; strict user isolation
**Scale/Scope**: Multi-user; CRUD operations for tasks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-driven traceability: plan references spec sections and requirements
- [x] AuthN: every endpoint includes JWT verification and derives user identity from JWT claims
- [x] AuthZ: all task queries are scoped by authenticated user at the query layer
- [x] Error taxonomy: status codes + error shapes are consistent (401/403/404/422/500)
- [x] Secrets: secrets come only from environment variables (BETTER_AUTH_SECRET, DATABASE_URL)
- [x] Separation of concerns: backend owns authorization + data access (backend-only feature)

## Project Structure

### Documentation (this feature)

```text
specs/001-tasks-crud/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── http-api.md
│   └── errors.md
└── tasks.md   # generated later by /sp.tasks
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── session.py
│   │   └── models.py
│   └── api/
│       └── routes/
│           └── tasks.py
└── tests/
    ├── integration/
    └── unit/
```

**Structure Decision**: Use a single backend app package under `backend/app/` to keep boundaries
clear (config/security/db/routes) and to enable independent deployment of backend.

## Phase 0: Outline & Research

### 0.1 Clarify JWT claim mapping for user identity
- **Goal**: Define which JWT claim is treated as the canonical `user_id` and how it maps to
  `{user_id}` in the URL.
- **Output**: `specs/001-tasks-crud/research.md` decision section.
- **Acceptance check**: Document a single claim name (e.g., `sub`) and how it is parsed/validated.

### 0.2 Define error response shape
- **Goal**: Standardize JSON error format for 401/403/404/422/500.
- **Output**: `specs/001-tasks-crud/contracts/errors.md`
- **Acceptance check**: Each error includes: `code`, `message` (and optional `details`).

### 0.3 Neon connection strategy (serverless-safe)
- **Goal**: Decide connection string usage and pooling expectations (basic, no over-engineering).
- **Output**: research.md note.
- **Acceptance check**: Decide single `DATABASE_URL` env var (with SSL as required by Neon).

## Phase 1: Design & Contracts

### 1.1 Data model design (Task)
- **Goal**: Finalize Task entity fields, validation rules, and ownership rules.
- **Output**: `data-model.md`
- **Acceptance check**: Task has required `title`, immutable `user_id` ownership, timestamps.

### 1.2 HTTP API contracts
- **Goal**: Specify request/response schemas and behaviors for all endpoints.
- **Output**: `contracts/http-api.md`
- **Acceptance check**: Covers list/create/read/update/delete/complete with status codes.

### 1.3 Quickstart plan for local verification
- **Goal**: Define how to run backend locally with env vars and call endpoints.
- **Output**: `quickstart.md`
- **Acceptance check**: Includes curl examples with Authorization header and expected outcomes.

## Phase 2: Implementation Steps (ordered, verifiable)

> These steps are written to be executed via `/sp.tasks` + Claude Code (no manual coding).

1. **Initialize backend project structure**
   - Create `backend/app` package, `backend/tests` folders, and minimal FastAPI entrypoint.
   - Verify: `python -m backend.app.main` (or uvicorn) starts without errors.

2. **Environment configuration (Neon DB + secrets)**
   - Add config loader that reads `DATABASE_URL` and `BETTER_AUTH_SECRET` from environment.
   - Verify: startup fails fast with clear error if env vars missing.

3. **Database schema design with SQLModel**
   - Implement SQLModel Task model matching spec fields.
   - Verify: model imports and metadata loads.

4. **DB connection + session management**
   - Create engine + session dependency for request-scoped DB sessions.
   - Verify: a health check or simple query can run (e.g., select 1).

5. **JWT verification dependency/middleware**
   - Implement FastAPI dependency that parses `Authorization: Bearer <token>`.
   - Verify: missing/invalid token returns 401 and never reaches route handlers.

6. **User identity extraction**
   - Decode JWT payload to obtain `user_id` and validate it matches `{user_id}` in route.
   - Verify: mismatch returns 403.

7. **Task CRUD route implementation**
   - Implement endpoints:
     - GET /api/{user_id}/tasks
     - POST /api/{user_id}/tasks
     - GET /api/{user_id}/tasks/{id}
     - PUT /api/{user_id}/tasks/{id}
     - DELETE /api/{user_id}/tasks/{id}
     - PATCH /api/{user_id}/tasks/{id}/complete
   - Verify: endpoints return expected status codes for basic happy paths.

8. **Enforce task ownership at query level**
   - All queries MUST include both `id == {id}` and `user_id == auth_user_id`.
   - Verify: cross-user access returns 404.

9. **Error handling and status codes**
   - Standardize errors per contracts/errors.md.
   - Verify: 401/403/404/422 responses match contract.

10. **Basic API validation and testability checks**
    - Add minimal integration tests for one flow (create → list → update → complete → delete).
    - Verify: tests pass locally with a test database.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
