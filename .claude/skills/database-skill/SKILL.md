---
name: database-skill
description: Design and manage databases including schema design, table creation, and migrations.
---

# Database Skill

## Instructions

1. **Schema design**
   - Design normalized and scalable database schemas
   - Choose appropriate data types and constraints
   - Define primary keys, foreign keys, and relationships

2. **Table creation**
   - Create tables with clear structure and naming conventions
   - Apply indexes for performance and query optimization
   - Enforce data integrity using constraints and validations

3. **Migrations**
   - Create and manage database migrations safely
   - Handle schema changes without data loss
   - Support rollbacks and version control for migrations

4. **Data management**
   - Ensure consistency and integrity of stored data
   - Optimize queries and database access patterns
   - Prepare schemas for future scalability

## Best Practices
- Follow database normalization principles
- Use migrations for all schema changes
- Avoid breaking changes in production databases
- Keep schemas simple and well-documented
- Optimize indexes based on real query patterns

## Example Structure
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
