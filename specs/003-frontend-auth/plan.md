# plan.md
## Frontend Authentication for Todo App

### Goal

Build a clean, responsive Next.js frontend that integrates with Better Auth for user authentication and securely consumes backend REST APIs using JWT tokens. The application provides signup, signin, and todo management functionality using client-side authentication flows only.

---

## Implementation Steps

1. Initialize a Next.js 16+ project using App Router
2. Configure Better Auth on the client for signup and signin
3. Implement client-side JWT storage (localStorage or in-memory)
4. Create a centralized API utility to attach JWT to all requests
5. Implement client-side route protection using guards or hooks
6. Build `/signup` page with Better Auth integration
7. Build `/signin` page with Better Auth integration
8. Build `/todos` page accessible only to authenticated users
9. Implement task CRUD operations via backend REST APIs
10. Handle loading, success, and error UI states
11. Add automatic JWT removal and redirect on 401 responses
12. Apply responsive, mobile-first styling
13. Perform frontend-only flow testing (manual or UI-level)
14. Improve accessibility and performance

---

## Constraints

- Frontend-only implementation
- No backend or database changes
- No server-side authentication logic
- No JWT verification on frontend
- JWT used only for API authorization headers
- REST API communication only
- Mobile responsiveness required
