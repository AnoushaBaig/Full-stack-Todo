from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated

import jwt
from fastapi import Depends, Header
from jwt import InvalidTokenError

from .config import Settings, get_settings
from .errors import http_error


@dataclass(frozen=True)
class AuthToken:
    user_id: str


def _parse_bearer_token(authorization: str | None) -> str:
    if not authorization:
        raise http_error(status_code=401, code="AUTH_UNAUTHORIZED", message="Missing Authorization header.")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise http_error(status_code=401, code="AUTH_UNAUTHORIZED", message="Invalid Authorization header format.")

    return parts[1].strip()


def verify_jwt_and_get_token(
    authorization: Annotated[str | None, Header()] = None,
    settings: Settings = Depends(get_settings),
) -> AuthToken:
    token_str = _parse_bearer_token(authorization)

    try:
        payload = jwt.decode(
            token_str,
            key=settings.better_auth_secret,
            algorithms=["HS256"],
            options={"require": ["sub"], "verify_signature": True},
        )
    except InvalidTokenError:
        raise http_error(status_code=401, code="AUTH_UNAUTHORIZED", message="Invalid or expired token.")

    sub = payload.get("sub")
    if not isinstance(sub, str) or not sub.strip():
        raise http_error(status_code=401, code="AUTH_UNAUTHORIZED", message="Token subject is missing.")

    return AuthToken(user_id=sub)


def require_path_user_matches_token(
    user_id: str,
    token: AuthToken = Depends(verify_jwt_and_get_token),
) -> AuthToken:
    if token.user_id != user_id:
        raise http_error(status_code=403, code="AUTH_FORBIDDEN", message="Forbidden.")

    return token
