from fastapi import Depends, FastAPI, HTTPException, APIRouter
from sqlalchemy.orm import Session
import api.schemas.UserSchemas as UserSchemas
import api.services.UserServices as User
from api.dependencies import get_db

router = APIRouter()


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


@router.get("/user/{id}", response_model=UserSchemas.User)
def read_user(id: int, db: Session = Depends(get_db)):
    db_user = User.get_user(db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
