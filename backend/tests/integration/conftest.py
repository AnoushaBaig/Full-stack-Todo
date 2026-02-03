import os
import time

import jwt
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch):
    # Ensure env vars are set BEFORE importing backend modules that load settings at import time.
    monkeypatch.setenv("DATABASE_URL", os.getenv("DATABASE_URL", "sqlite:///./test.db"))
    monkeypatch.setenv("BETTER_AUTH_SECRET", os.getenv("BETTER_AUTH_SECRET", "dev-secret"))

    from backend.app.main import create_app

    app = create_app()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def make_auth_header() -> callable:
    def _make(user_id: str) -> dict[str, str]:
        secret = os.getenv("BETTER_AUTH_SECRET")
        assert secret

        token = jwt.encode(
            {"sub": user_id, "exp": int(time.time()) + 3600},
            secret,
            algorithm="HS256",
        )
        return {"Authorization": f"Bearer {token}"}

    return _make


@pytest.fixture(autouse=True)
def _init_and_clean_db(client) -> None:
    # Ensure schema exists, then clean table between tests.
    from sqlmodel import Session, delete

    from backend.app.db.models import Task
    from backend.app.db.session import engine, init_db

    init_db()

    with Session(engine) as session:
        session.exec(delete(Task))
        session.commit()
