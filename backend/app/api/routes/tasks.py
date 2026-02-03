from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlmodel import Session, select

from ..schemas.tasks import TaskCreate, TaskRead, TaskUpdate
from ...core.errors import http_error
from ...core.security import AuthToken, require_path_user_matches_token
from ...db.models.task import Task
from ...db.session import get_session

router = APIRouter(tags=["tasks"])


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _get_task_for_user_or_404(*, session: Session, task_id: int, user_id: str) -> Task:
    stmt = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(stmt).first()
    if task is None:
        raise http_error(status_code=404, code="TASK_NOT_FOUND", message="Task not found.")
    return task


@router.get("/api/{user_id}/tasks", response_model=list[TaskRead])
def list_tasks(
    user_id: str,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> list[Task]:
    stmt = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    return list(session.exec(stmt).all())


@router.post("/api/{user_id}/tasks", response_model=TaskRead, status_code=201)
def create_task(
    user_id: str,
    payload: TaskCreate,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> Task:
    task = Task(
        user_id=user_id,
        title=payload.title,
        description=payload.description,
        completed=False,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/api/{user_id}/tasks/{id}", response_model=TaskRead)
def read_task(
    user_id: str,
    id: int,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> Task:
    return _get_task_for_user_or_404(session=session, task_id=id, user_id=user_id)


@router.put("/api/{user_id}/tasks/{id}", response_model=TaskRead)
def update_task(
    user_id: str,
    id: int,
    payload: TaskUpdate,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> Task:
    task = _get_task_for_user_or_404(session=session, task_id=id, user_id=user_id)
    task.title = payload.title
    task.description = payload.description
    task.updated_at = utc_now()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.patch("/api/{user_id}/tasks/{id}/complete", response_model=TaskRead)
def complete_task(
    user_id: str,
    id: int,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> Task:
    task = _get_task_for_user_or_404(session=session, task_id=id, user_id=user_id)
    task.completed = True
    task.updated_at = utc_now()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/api/{user_id}/tasks/{id}", status_code=204)
def delete_task(
    user_id: str,
    id: int,
    _: AuthToken = Depends(require_path_user_matches_token),
    session: Annotated[Session, Depends(get_session)] = None,
) -> Response:
    task = _get_task_for_user_or_404(session=session, task_id=id, user_id=user_id)
    session.delete(task)
    session.commit()
    return Response(status_code=204)
