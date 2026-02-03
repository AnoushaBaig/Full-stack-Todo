---
name: backend-skill
description: Build backend APIs by generating routes, handling request and response logic, and connecting to databases.
---

# Backend Skill

## Instructions

1. **Route generation**
   - Create RESTful API routes with clear structure
   - Use proper HTTP methods and status codes
   - Organize routes by feature or resource

2. **Request and response handling**
   - Validate incoming requests
   - Parse and transform request data safely
   - Structure consistent and predictable API responses
   - Handle errors gracefully without exposing internals

3. **Database connectivity**
   - Connect backend services to databases securely
   - Perform CRUD operations efficiently
   - Manage transactions and error handling
   - Ensure data consistency and integrity

4. **Application logic**
   - Implement business rules in a clean and maintainable way
   - Separate concerns between routes, services, and data layers
   - Apply middleware and dependency injection where appropriate

## Best Practices
- Follow REST API design principles
- Validate all inputs and outputs
- Keep routes thin and logic modular
- Use environment variables for secrets
- Write scalable and maintainable backend code

## Example Structure
```python
@app.post("/users")
async def create_user(payload: UserCreate):
    user = await user_service.create(payload)
    return {"id": user.id, "email": user.email}
