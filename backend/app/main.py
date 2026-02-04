from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from .api.routes.tasks import router as tasks_router
from .api.routes.auth import router as auth_router
from .core.config import get_settings
from .core.errors import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
# ❌ TEMPORARILY disable DB init (HF pe hang ho raha tha)
# from .db.session import init_db


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name)

    # ✅ FIXED CORS (Vercel + browser compatible)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
        "https://full-stack-todo-ecy4.vercel.app",   # apna exact vercel domain
        "https://*.vercel.app",  # Allow any Vercel subdomain
        "http://localhost:3000",  # Allow local development
        "http://localhost:3001",  # Allow alternative local port
        "http://127.0.0.1:3000",  # Allow local IPv4
        "http://127.0.0.1:3001",  # Allow alternative local port
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    # Routers
    app.include_router(tasks_router)
    app.include_router(auth_router)

    # ❌ Disable startup DB init for now
    # @app.on_event("startup")
    # def _startup() -> None:
    #     init_db()

    return app


app = create_app()
