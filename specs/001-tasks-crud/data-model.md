# Data Model: 001-tasks-crud

## Entity: Task

### Purpose
Represents a single user-owned todo item.

### Fields

- `id` (primary key): unique identifier
- `user_id` (required): identifies the owning user; MUST be derived from JWT identity
- `title` (required): short text; MUST be non-empty
- `description` (optional): longer text
- `completed` (required): boolean; defaults false
- `created_at` (required): timestamp
- `updated_at` (required): timestamp

### Ownership Rules

- Every Task MUST belong to exactly one user.
- All read/write operations MUST scope by `user_id` at the query level.
- `user_id` is immutable once created.

### State Transitions

- `completed: false → true` via the "complete" endpoint.
- Updating other fields MUST NOT implicitly change ownership.
