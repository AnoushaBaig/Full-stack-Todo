---
id: 0005
title: Propose T011-T023 implementation
stage: explainer
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-tasks-crud
branch: 001-ai-book-constitution
user: unknown
command: backend-skill
labels: [fastapi, sqlmodel, tasks-crud, testing]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - none
tests:
 - none
---

## Prompt

Given the repo context, propose concrete FastAPI + SQLModel implementations for tasks T011-T023 (schemas, routes, CRUD, 404 scoping), aligned to specs/001-tasks-crud/contracts/*. Include test structure for T010/T016/T020. Don't write code directly; return file-by-file change list and any pitfalls.

## Response snapshot

Identified that core Task model, schemas, auth dependency, and all CRUD routes (list/create/read/update/complete/delete) already exist and largely satisfy T011–T023 and the contracts. Proposed minimal follow-up deltas focused on testability (real JWT generation, deterministic DB engine creation for tests) and edge-case alignment (cross-user 404, 403 only for path mismatch). Outlined integration test files for T010/T016/T020 and highlighted pitfalls around engine initialization timing and sqlite threading.

## Outcome

- ✅ Impact: Concrete implementation mapping for T011–T023 plus integration test structure for T010/T016/T020.
- 🧪 Tests: Not run (design-only request).
- 📁 Files: No code changes made.
- 🔁 Next prompts: Implement tests; fix DB engine/test fixtures as needed.
- 🧠 Reflection: Most tasks were already implemented; remaining work is primarily around robust, isolated integration tests.

## Evaluation notes (flywheel)

- Failure modes observed: Test suite likely fails due to dummy JWT and engine created before env patch.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Update test fixtures to mint HS256 JWTs and ensure DB engine uses test DATABASE_URL reliably.
