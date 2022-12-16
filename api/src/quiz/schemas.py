from pydantic import BaseModel

class QuizCreate(BaseModel):
    name : str
    description : str

    class Config:
        orm_mode = True