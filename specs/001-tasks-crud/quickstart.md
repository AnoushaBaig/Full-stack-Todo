# Quickstart: 001-tasks-crud (backend)

## Prerequisites

- Environment variables:
  - `DATABASE_URL` (Neon Postgres connection string)
  - `BETTER_AUTH_SECRET` (JWT verification secret)

## Run locally

1. Start the FastAPI server (exact command will depend on project layout chosen in tasks).
2. Use a valid JWT for a test user.

## Verify with curl (examples)

> Replace `{user_id}` with the token subject, and `$JWT` with your token.

### List

```bash
curl -sS -H "Authorization: Bearer $JWT" \
  http://localhost:8000/api/{user_id}/tasks
```

Expected:
- `200` and JSON array

### Create

```bash
curl -sS -X POST -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"2 liters"}' \
  http://localhost:8000/api/{user_id}/tasks
```

Expected:
- `201` and created task JSON

### Cross-user attempt

```bash
curl -i -H "Authorization: Bearer $JWT" \
  http://localhost:8000/api/some-other-user/tasks
```

Expected:
- `403`
