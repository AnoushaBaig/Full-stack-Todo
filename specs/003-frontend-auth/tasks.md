# task.md
## Frontend Authentication for Todo App

### Objective

Implement a frontend-only authentication system with signup, signin, and protected todo management pages using Next.js, Better Auth, and JWT-based API authorization.

---

## Phase 1: Project Setup and Auth Foundation

- [X] T001 Initialize Next.js 16+ project with App Router
- [X] T002 Install and configure Better Auth (client-side only)
- [X] T003 Implement JWT storage utility (localStorage)
- [X] T004 Create API utility to attach JWT to requests
- [X] T005 Implement client-side auth guard hook/component

---

## Phase 2: Authentication Pages

- [X] T006 Create `/signup` page with Better Auth
- [X] T007 Create `/signin` page with Better Auth
- [X] T008 Add form validation for auth pages
- [X] T009 Implement loading and error states
- [X] T010 Apply responsive styling to auth pages

---

## Phase 3: Todo Management UI

- [X] T011 Create `/todos` protected page layout
- [X] T012 Implement task list UI
- [X] T013 Implement task creation UI
- [X] T014 Implement task update UI
- [X] T015 Implement task deletion UI
- [X] T016 Implement task completion toggle
- [X] T017 Apply responsive design to todos UI

---

## Phase 4: API Integration & Error Handling

- [X] T018 Integrate task creation API
- [X] T019 Integrate task listing API
- [X] T020 Integrate task update API
- [X] T021 Integrate task deletion API
- [X] T022 Integrate task completion API
- [X] T023 Handle 401 responses with logout + redirect
- [X] T024 Display user-friendly API error messages

---

## Phase 5: Validation & Final Checks

- [X] T025 Validate full auth flow (signup → signin → todos)
- [X] T026 Verify protected routes block unauthenticated users
- [X] T027 Verify JWT expiration handling (auto logout)
- [X] T028 Perform cross-browser UI testing
- [X] T029 Improve performance and accessibility
- [X] T030 Final frontend flow validation

---

## Constraints

- Frontend-only scope
- No backend or database changes
- JWT used only for Authorization headers
- REST API consumption only
- Next.js App Router required
- Mobile-responsive UI

---

## Completion Criteria

- Users can authenticate via Better Auth
- JWT tokens are correctly stored and attached
- Todos are accessible only after authentication
- 401 responses trigger logout and redirect
- UI is responsive, accessible, and stable