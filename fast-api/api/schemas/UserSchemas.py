from pydantic import BaseModel


class UserBase(BaseModel):
    username: str


class UserInDB(UserBase):
    hashed_password: str


class UserCreate(UserBase):
    email: str
    password: str


class User(UserBase):
    username: str
    email: str | None = None
    disabled: bool | None = None

    class Config:
        orm_mode = True
