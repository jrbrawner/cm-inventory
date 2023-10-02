from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    username: str


class Login(BaseModel):
    username: str
    password: str


class UserInDB(UserBase):
    hashed_password: str


class UserCreate(UserBase):
    email: str
    password: str


class UserDisplay(UserBase):
    username: str


class User(UserBase):
    username: str
    email: str | None = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None
