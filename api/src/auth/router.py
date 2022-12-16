from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import src.auth.UserSchemas as UserSchemas
import src.auth.UserServices as User
from src.dependencies import get_db
from enum import Enum

router = APIRouter()

class UserLookup(str, Enum):
    Username = "username"
    Id = "id"


@router.post("/user", response_model=UserSchemas.User)
def create_user(user: UserSchemas.UserCreate, db: Session = Depends(get_db)):
    db_user = User.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return User.create_user(db=db, user=user)


@router.get("/user", response_model=list[UserSchemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = User.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/user/{type}/{value}", response_model=UserSchemas.User)
def read_user(type : UserLookup, value : str or int,  db: Session = Depends(get_db)):

    if type is UserLookup.Id:
        db_user = User.get_user(db, user_id=value)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User with that id not found.")
        return db_user
    if type is UserLookup.Username:
        db_user = User.get_user_by_username(db, username=value)
        if db_user is None:
            raise HTTPException(
                status_code=404, detail="User with that username not found."
            )
        return db_user



