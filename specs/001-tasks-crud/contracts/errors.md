# Error Contract: 001-tasks-crud

All errors MUST be JSON and MUST use this shape:

```json
{"code":"<STRING_CODE>","message":"<HUMAN_READABLE>","details":{}}
```

## Status Codes

- **401 Unauthorized**
  - When: Missing, invalid, or expired JWT
  - Example code: `AUTH_UNAUTHORIZED`

- **403 Forbidden**
  - When: `token_user_id != {user_id}` (path mismatch)
  - Example code: `AUTH_FORBIDDEN`

- **404 Not Found**
  - When: Task id does not exist *for the authenticated user* (including cross-user access)
  - Example code: `TASK_NOT_FOUND`

- **422 Unprocessable Entity**
  - When: Input validation fails (e.g., missing title)
  - Example code: `VALIDATION_ERROR`

- **500 Internal Server Error**
  - When: Unexpected server failure
  - Example code: `INTERNAL_ERROR`

## Notes

- Error messages MUST NOT include secrets, JWTs, DB URLs, or stack traces.
