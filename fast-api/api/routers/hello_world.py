from fastapi import APIRouter, Depends, HTTPException, status
from api.schemas import TokenSchemas, UserSchemas
from api.dependencies import get_db, get_current_user
from sqlalchemy.orm import Session
import api.services.UserServices as UserServices
from api.settings import settings
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from api.models.UserModels import UserModel

router = APIRouter()


@router.get("/")
async def hello_world():
    return {"Hello": "World"}

@router.post("/token", response_model=TokenSchemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = UserServices.authenticate_user(db, form_data.username, form_data.password)
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

@router.get("/user/me", response_model=UserSchemas.UserBase)
def read_users_me(current_user: UserSchemas.UserBase = Depends(get_current_user)):
    user = current_user
    return user