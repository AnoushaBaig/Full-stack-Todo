from __future__ import annotations

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from .api.routes.tasks import router as tasks_router
from .api.routes.auth import router as auth_router
from .core.config import get_settings
from .core.errors import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from .db.session import init_db


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    app.include_router(tasks_router)
    app.include_router(auth_router)

    @app.on_event("startup")
    def _startup() -> None:
        init_db()

    return app


app = create_app()
