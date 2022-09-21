from pydantic import BaseModel


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
    id: int


class User(UserBase):
    username: str
    email: str | None = None

    class Config:
        orm_mode = True
