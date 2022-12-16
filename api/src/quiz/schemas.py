from pydantic import BaseModel, validator


class QuizCreate(BaseModel):
    name: str
    description: str
    num_questions: int

    class Config:
        orm_mode = True

    @validator("num_questions")
    def num_questions_validator(cls, v):
        if v > 50:
            raise ValueError("Quiz cannot have more than 50 questions.")
        return v
