# HTTP API Contract: 001-tasks-crud

Base path: `/api/{user_id}/tasks`

## Auth

- Every request MUST include `Authorization: Bearer <jwt>`.
- Server MUST validate JWT and extract `token_user_id`.
- If `token_user_id != {user_id}` → return **403**.

## Endpoints

### 1) List tasks

`GET /api/{user_id}/tasks`

- **200**: returns a JSON array of Task objects owned by `{user_id}`.
- **401/403** per auth rules.

### 2) Create task

`POST /api/{user_id}/tasks`

- Request body: `{ "title": string, "description"?: string }`
- **201**: returns created Task
- **422** if title missing/empty

### 3) Read task

`GET /api/{user_id}/tasks/{id}`

- **200**: returns Task
- **404** if not found for this user

### 4) Update task

`PUT /api/{user_id}/tasks/{id}`

- Request body: `{ "title": string, "description"?: string }`
- **200**: returns updated Task
- **404** if not found for this user
- **422** if invalid input

### 5) Delete task

`DELETE /api/{user_id}/tasks/{id}`

- **204**: deleted
- **404** if not found for this user

### 6) Complete task

`PATCH /api/{user_id}/tasks/{id}/complete`

- Request body: empty
- **200**: returns updated Task with `completed: true`
- **404** if not found for this user

## Task representation

A Task JSON object contains:

```json
{
  "id": "<id>",
  "user_id": "<user_id>",
  "title": "<title>",
  "description": "<optional>",
  "completed": false,
  "created_at": "<timestamp>",
  "updated_at": "<timestamp>"
}
```
