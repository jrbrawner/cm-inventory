from fastapi import APIRouter, Depends, HTTPException, status
from api.schemas import TokenSchemas, UserSchemas
from api.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
import api.services.UserServices as UserServices
from api.settings import settings
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from api.models.UserModels import UserModel
import logging

router = APIRouter()
#https://www.jetbrains.com/pycharm/guide/tutorials/fastapi-aws-kubernetes/auth_jwt/

@router.get("/")
async def hello_world():
    return {"Hello": "World"}


@router.post("/token")  
async def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = UserServices.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = UserServices.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/user/me", response_model=UserSchemas.UserDisplay)
def read_users_me(current_user: UserSchemas.User = Depends(get_current_user)):
    print(current_user.username)
    user = current_user
    return user
