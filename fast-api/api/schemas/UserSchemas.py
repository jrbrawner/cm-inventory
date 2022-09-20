from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str

class UserInDB(UserBase):
    hashed_password: str

class UserCreate(UserBase):
    password: str
    

class User(UserBase):
    username: str
    email: str | None = None
    disabled: bool | None = None

    class Config:
        orm_mode = True
