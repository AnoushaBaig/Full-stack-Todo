# plan.md
## Spec-2: Backend Auth & Security Integration (JWT)

### Goal
Secure the FastAPI backend by validating JWT tokens, enforcing authenticated user identity, and ensuring strict task ownership using Neon PostgreSQL.

---

## Implementation Steps

1. Load `BETTER_AUTH_SECRET` from backend environment
2. Implement JWT verification utility (signature + expiry check)
3. Decode JWT and extract authenticated `user_id`
4. Define SQLModel schema for `users` table
5. Define SQLModel schema for `tasks` table
6. Enforce foreign key relationship: `tasks.user_id → users.id`
7. Add authentication dependency to all task routes
8. Reject requests without JWT (401 Unauthorized)
9. Reject invalid or expired JWTs (401 Unauthorized)
10. Enforce `user_id` ownership at query level (403 Forbidden)
11. Validate data persistence in Neon PostgreSQL
12. Add basic backend integration tests for auth enforcement

---

## Constraints
- Backend only (FastAPI)
- No frontend / Next.js code
- No signup/signin UI
- JWT verification only (token issuing handled elsewhere)
- Stateless authentication
