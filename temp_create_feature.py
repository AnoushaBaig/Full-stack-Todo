#!/usr/bin/env python3

import os
import sys
import shutil
from pathlib import Path

def create_new_feature(number, short_name, feature_desc):
    # Create the spec directory
    spec_dir = f"specs/{number:03d}-{short_name}"
    os.makedirs(spec_dir, exist_ok=True)

    # Create the spec file
    spec_file = f"{spec_dir}/spec.md"
    with open(spec_file, 'w') as f:
        f.write(feature_desc)

    # Create the plan file
    plan_file = f"{spec_dir}/plan.md"
    with open(plan_file, 'w') as f:
        f.write(f"# plan.md\n## {short_name}\n\n### Goal\n\n[Goal description]\n\n---\n\n## Implementation Steps\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n---\n\n## Constraints\n\n- [Constraint 1]\n- [Constraint 2]\n\n")

    # Create the tasks file
    tasks_file = f"{spec_dir}/tasks.md"
    with open(tasks_file, 'w') as f:
        f.write(f"# task.md\n## {short_name}\n\n### Objective\n\n[Objective description]\n\n---\n\n## Phase 1: Setup\n\n- [ ] T001 Task 1\n- [ ] T002 Task 2\n\n---\n\n## Phase 2: Implementation\n\n- [ ] T003 Task 3\n- [ ] T004 Task 4\n\n---\n\n## Phase 3: Testing\n\n- [ ] T005 Task 5\n- [ ] T006 Task 6\n\n---\n\n## Constraints\n\n- Constraint 1\n- Constraint 2\n\n---\n\n## Completion Criteria\n\n- Criterion 1\n- Criterion 2\n")

    # Create checklists directory
    checklist_dir = f"{spec_dir}/checklists"
    os.makedirs(checklist_dir, exist_ok=True)

    # Return JSON result
    result = {
        "BRANCH_NAME": f"{number:03d}-{short_name}",
        "SPEC_FILE": spec_file,
        "PLAN_FILE": plan_file,
        "TASKS_FILE": tasks_file
    }

    print(result)

# Call the function with the parameters
create_new_feature(3, "frontend-auth", """Todo Full-Stack App – Spec-3: Frontend (Next.js)

Target audience:
- Claude Code agent
- Frontend reviewers

Primary focus:
- Build a clean, responsive Next.js frontend
- Consume backend REST APIs securely
- Manage authenticated user experience using JWT

Success criteria:
- Users can sign up and sign in using Better Auth
- Only authenticated users can access todo pages
- Users can create, view, update, delete, and complete tasks
- JWT is automatically attached to every API request
- 401 responses redirect users to the signin page
- UI reflects only the authenticated user's tasks

Functional requirements:
- Framework: Next.js 16+ with App Router
- Authentication:
  - Better Auth (frontend usage only)
  - JWT handling on client side (store, attach, clear)
- Pages:
  - `/signup`
  - `/signin`
  - `/todos`
- Todo UI features:
  - List tasks
  - Create new task
  - Edit task
  - Delete task
  - Toggle task completion
- API integration:
  - Use backend REST endpoints only
  - Send JWT via `Authorization: Bearer <token>`
  - Handle loading, success, and error states

UX & behavior:
- Redirect unauthenticated users to `/signin`
- Gracefully handle empty task lists
- Display API errors in user-friendly form
- Keep UI responsive (mobile + desktop)

Constraints:
- Frontend-only scope
- No backend or database logic
- No JWT verification (backend responsibility)
- No direct Neon DB access
- No server-side auth state
- REST API communication only

Explicitly not building:
- Admin or multi-role UI
- Analytics or reporting dashboards
- Real-time updates (WebSockets)
- Offline or sync support
- Complex animations or theming.""")