<!--
Sync Impact Report
- Version change: unversioned template → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections:
  - System Constraints
  - Development Workflow & Quality Gates
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ⚠ pending .specify/templates/commands/*.md (directory not present in repo)
- Follow-up TODOs:
  - TODO(RATIFICATION_DATE): original ratification date is unknown; set when first formally adopted.
-->

# Todo Full-Stack Web Application (Multi-User, Secure, Spec-Driven) Constitution

## Core Principles

### I. Spec-Driven Development (Non-Negotiable)
All system behavior MUST originate from written specifications under `specs/`.

- Implementations MUST NOT introduce functionality that is not explicitly specified.
- When requirements are ambiguous or missing, work MUST stop and clarification MUST be captured in
  the spec before implementation continues.
- Frontend, backend, and auth behavior MUST be traceable back to spec requirements.

### II. Security-First, Strict User Data Isolation
Security and cross-user isolation are primary design constraints.

- Every API endpoint MUST require authenticated requests unless explicitly marked public in the
  relevant spec.
- All data access MUST be scoped to the authenticated user at the query level.
- Cross-user data access MUST be impossible via API or UI (no “filter on client” for security).
- Errors/logs MUST NOT leak secrets, JWTs, refresh tokens, database URLs, or PII.

### III. Stateless Authentication with JWT (Better Auth)
Authentication state MUST be stateless and token-based.

- JWT tokens MUST be verified on every request.
- User identity MUST be derived only from validated JWT payload claims.
- Requests without valid tokens MUST return `401 Unauthorized`.
- Authorization MUST be enforced server-side; frontend MUST NEVER bypass backend authorization.

### IV. Deterministic, Reproducible Agentic Workflows
Work MUST be repeatable from specs using agentic workflows.

- No “manual coding” changes that cannot be reproduced from the spec-driven workflow.
- Builds MUST be deterministic and reproducible (no hidden steps).
- Secrets MUST be provided via environment variables (e.g., `BETTER_AUTH_SECRET`) and MUST NOT be
  committed.

### V. Clear Separation of Concerns (Frontend / Backend / Auth)
The system MUST maintain clear boundaries between layers.

- Frontend (Next.js App Router) MUST use backend REST APIs for all data mutations.
- Backend (FastAPI) MUST own authorization decisions and data access.
- Auth (Better Auth) MUST be treated as security-critical infrastructure and configured explicitly.
- API contracts MUST be JSON-only and RESTful; error semantics MUST be consistent.

### VI. Explicit Errors, Debuggability, and Quality Gates
The system MUST be operable and debuggable without compromising security.

- Errors MUST be explicit, consistent, and documented (status codes + error shapes in contracts).
- Logging MUST aid debugging while avoiding sensitive data.
- Changes MUST be small, testable, and reviewed against this constitution.

## System Constraints

### Technology Stack (Hard Constraints)

- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- API style: RESTful, JSON-only
- Shared secret: `BETTER_AUTH_SECRET` via environment variables

### Security Requirements (Hard Constraints)

- All API routes MUST verify JWT authentication on every request.
- Unauthenticated requests MUST return `401 Unauthorized`.
- Authorization MUST enforce resource ownership; tasks MUST be filtered by authenticated user.
- Cross-user data access MUST be forbidden by design.
- No server-side sessions.

## Development Workflow & Quality Gates

### Spec-Driven Flow (Required)

- Spec first: create/update `specs/<feature>/spec.md` before implementation.
- Plan second: capture architecture/approach in `specs/<feature>/plan.md`.
- Tasks third: generate testable steps in `specs/<feature>/tasks.md`.
- Implement last: code changes MUST follow the spec/plan/tasks.

### Quality Gates (Must Pass)

- Every new/changed endpoint MUST:
  - Validate JWT and derive user identity from token claims.
  - Enforce user ownership at the query layer.
  - Return consistent, documented error responses.
- Frontend MUST:
  - Treat the backend as the source of truth for authorization.
  - Handle `401/403` consistently and not cache/assume authorization client-side.

## Governance

This constitution supersedes local conventions and templates.

- Amendments MUST:
  - Describe the change and rationale.
  - Update related templates if this constitution adds/changes required sections.
  - Include a version bump following semantic versioning for governance:
    - MAJOR: breaking governance changes (principle removal/redefinition)
    - MINOR: new principle/section or materially expanded guidance
    - PATCH: clarifications/wording without semantic change
- Reviews MUST include a constitution compliance check for:
  - Spec-driven traceability
  - AuthN/AuthZ enforcement
  - User data isolation
  - Secrets handling

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
