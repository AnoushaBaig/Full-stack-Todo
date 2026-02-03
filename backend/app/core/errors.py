from __future__ import annotations

from typing import Any

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def error_response(*, status_code: int, code: str, message: str, details: dict[str, Any] | None = None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "code": code,
            "message": message,
            "details": details or {},
        },
    )


def http_error(*, status_code: int, code: str, message: str, details: dict[str, Any] | None = None) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={
            "code": code,
            "message": message,
            "details": details or {},
        },
    )


async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, dict):
        code = str(detail.get("code") or "INTERNAL_ERROR")
        message = str(detail.get("message") or "An error occurred.")
        details = detail.get("details")
        if not isinstance(details, dict):
            details = {} if details is None else {"raw": details}
        return error_response(status_code=exc.status_code, code=code, message=message, details=details)

    return error_response(status_code=exc.status_code, code="INTERNAL_ERROR", message="An error occurred.")


async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    return error_response(
        status_code=422,
        code="VALIDATION_ERROR",
        message="Input validation failed.",
        details={"errors": exc.errors()},
    )


async def unhandled_exception_handler(_: Request, __: Exception) -> JSONResponse:
    return error_response(status_code=500, code="INTERNAL_ERROR", message="Internal server error.")
