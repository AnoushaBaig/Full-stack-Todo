from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from ...core.config import Settings, get_settings
from ...core.errors import http_error
from ...db.models.user import User
from ...db.session import get_session

router = APIRouter(tags=["auth"])

class SignUpRequest(BaseModel):
    email: str
    password: str

class SignInRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user_id: str
    email: str

def create_access_token(data: dict, settings: Settings) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)  # Token valid for 30 days
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.better_auth_secret, algorithm="HS256")
    return encoded_jwt

@router.post("/auth/signup", response_model=AuthResponse)
def signup(
    request: SignUpRequest,
    settings: Annotated[Settings, Depends(get_settings)],
    session: Annotated[Session, Depends(get_session)],
) -> AuthResponse:
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == request.email)).first()
    if existing_user:
        raise http_error(status_code=400, code="USER_EXISTS", message="User with this email already exists")

    # Hash the password
    hashed_password = User.hash_password(request.password)

    # Create new user with hashed password
    user = User(
        email=request.email,
        name=request.email.split("@")[0],  # Use part before @ as name
        hashed_password=hashed_password
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create JWT token
    token_data = {
        "sub": user.id,  # Use user ID as subject
        "email": user.email,
        "name": user.name
    }
    token = create_access_token(token_data, settings)

    return AuthResponse(token=token, user_id=user.id, email=user.email)

@router.post("/auth/signin", response_model=AuthResponse)
def signin(
    request: SignInRequest,
    settings: Annotated[Settings, Depends(get_settings)],
    session: Annotated[Session, Depends(get_session)],
) -> AuthResponse:
    # Find user by email
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise http_error(status_code=401, code="INVALID_CREDENTIALS", message="Invalid email or password")

    # Verify the password
    if not user.verify_password(request.password):
        raise http_error(status_code=401, code="INVALID_CREDENTIALS", message="Invalid email or password")

    # Create JWT token
    token_data = {
        "sub": user.id,  # Use user ID as subject
        "email": user.email,
        "name": user.name
    }
    token = create_access_token(token_data, settings)

    return AuthResponse(token=token, user_id=user.id, email=user.email)