# Research: 001-tasks-crud

**Date**: 2026-01-08

## Decision: JWT claim used for `user_id`

- **Decision**: Treat the JWT claim `sub` as the canonical user identifier and map it to
  `{user_id}` in the API path.
- **Rationale**: `sub` is the standard subject claim for the authenticated principal. This keeps
  a single source of truth for identity.
- **Alternatives considered**:
  - `user_id` claim: clearer but non-standard; requires issuer agreement.
  - `email` claim: unstable identifier; not suitable as primary key.

## Decision: Error response shape

- **Decision**: Use a consistent JSON error body:

```json
{"code":"<STRING_CODE>","message":"<HUMAN_READABLE>","details":{}}
```

- **Rationale**: Keeps client handling simple and avoids leaking stack traces.

## Decision: Database connection configuration

- **Decision**: Use a single `DATABASE_URL` environment variable.
- **Rationale**: Minimal configuration; works for local/dev/prod when set appropriately.
- **Notes**: Neon may require SSL settings embedded in the URL depending on driver.
