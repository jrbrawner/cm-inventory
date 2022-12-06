from fastapi import APIRouter, Depends, HTTPException
from api.schemas import TokenSchemas, UserSchemas
from api.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
import api.services.UserServices as UserServices
from api.settings import settings
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from api.models.UserModels import UserModel
from typing import Any

router = APIRouter()
# https://www.jetbrains.com/pycharm/guide/tutorials/fastapi-aws-kubernetes/auth_jwt/


@router.post("/login/access-token", response_model=TokenSchemas.Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = UserServices.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    # elif not crud.user.is_active(user):
    #    raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": UserServices.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login/test-token", response_model=UserSchemas.User)
def test_token(current_user: UserModel = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user
