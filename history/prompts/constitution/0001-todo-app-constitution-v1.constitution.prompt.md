---
id: 0001
title: Todo app constitution v1
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-ai-book-constitution
user: unknown
command: /sp.constitution
labels: ["constitution","spec-driven","security","auth","todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
tests:
 - none
---

## Prompt

```text
Project: Todo Full-Stack Web Application (Multi-User, Secure, Spec-Driven)

Core principles:
- Spec-driven development: all behavior must originate from specs
- Security-first architecture with strict user data isolation
- Deterministic and reproducible builds using agentic workflows
- No manual coding; all implementation generated via Claude Code
- Clear separation of concerns between frontend, backend, and auth

Key standards:
- All system behavior must be explicitly specified before implementation
- Every API endpoint must enforce authenticated user ownership
- Authentication state must be stateless and token-based
- Frontend must never bypass backend authorization
- Errors must be explicit, consistent, and documented
- All data access must be scoped to the authenticated user
- No hidden logic outside specs

Constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- API style: RESTful, JSON-only
- Shared secret: BETTER_AUTH_SECRET via environment variables
- No manual database manipulation outside ORM
- No server-side sessions

Security requirements:
- All API routes require valid JWT authentication
- JWT tokens must be verified on every request
- User identity must be derived only from JWT payload
- Requests without tokens must return 401 Unauthorized
- Cross-user data access is strictly forbidden
- Task ownership must be enforced at query level

Quality requirements:
- Backend and frontend must be independently deployable
- System must support multiple concurrent users
- UI must be responsive across devices
- Code generation must be repeatable from specs
- Logs and errors must aid debugging without leaking secrets

Success criteria:
- All required Todo features function correctly
- Users can only view and modify their own tasks
- Unauthorized access is impossible via API or UI
- Project can be fully implemented using the Agentic Dev Stack
- Specs, plans, and generated code are reviewable and consistent.
```

## Response snapshot

- Updated `.specify/memory/constitution.md` by replacing all template placeholders with a concrete constitution for the secure, multi-user Todo full-stack app.
- Included an HTML-comment “Sync Impact Report” at the top, and set governance version to `1.0.0` with `Last Amended: 2026-01-08` and a deferred `TODO(RATIFICATION_DATE)`.
- Ensured principles and constraints capture: spec-driven workflow, JWT verification on every request, strict user data isolation, Better Auth usage, stack constraints (Next.js 16+, FastAPI, SQLModel, Neon).
- Updated `.specify/templates/plan-template.md` Constitution Check gate to include explicit checkboxes aligned to the new constitution.

## Outcome

- ✅ Impact: Constitution template is now project-specific and enforceable; plan template gates now reflect security + spec-driven requirements.
- 🧪 Tests: none (documentation/template update)
- 📁 Files: updated constitution + plan template gate section
- 🔁 Next prompts: Set ratification date; proceed with `/sp.specify` for the first feature (e.g., auth flow, todo CRUD)
- 🧠 Reflection: Scripted PHR creation was unavailable; created PHR using template-based agent-native flow.

## Evaluation notes (flywheel)

- Failure modes observed: Missing `.specify/scripts/bash/create-phr.sh`; missing `history/` directory initially.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Add a cross-platform PHR creation script (PowerShell) or document manual fallback.
