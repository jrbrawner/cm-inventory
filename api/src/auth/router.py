from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.auth.schemas import User, UserCreate, Token
from src.auth import services
from src.dependencies import get_db
from src.auth.constants import UserLookup
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from datetime import timedelta
from src.settings import settings
from src.dependencies import get_current_user

router = APIRouter()


@router.post("/api/user", response_model=User, tags=["auth"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return services.create_user(db=db, user=user)


@router.get("/api/user", response_model=list[User], tags=["auth"])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = services.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/api/user/{type}/{value}", response_model=User, tags=["auth"])
def read_user(type: UserLookup, value: str or int, db: Session = Depends(get_db)):

    if type is UserLookup.Id:
        db_user = services.get_user(db, user_id=value)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User with that id not found.")
        return db_user
    if type is UserLookup.Username:
        db_user = services.get_user_by_username(db, username=value)
        if db_user is None:
            raise HTTPException(
                status_code=404, detail="User with that username not found."
            )
        return db_user


@router.post("/api/login/access-token", response_model=Token, tags=["auth"])
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = services.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    # elif not crud.user.is_active(user):
    #    raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": services.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/api/login/test-token", response_model=User, tags=["auth"])
def test_token(current_user: User = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user
