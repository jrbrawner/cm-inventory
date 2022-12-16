from pydantic import BaseModel, validator
from typing import List
from src.quiz.models import QuizQuestion, QuizQuestionAnswer
from src.quiz.constants import QuizTypeEnum

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

class QuizDisplay(QuizCreate):
    author : int

class QuizQuestionAnswerDisplay(BaseModel):
    question_id : int | None = None
    text : str | None = None
    correct : bool | None = None

    class Config:
        orm_mode = True

class QuizQuestionDisplay(BaseModel):
    text : str | None = None
    type : QuizTypeEnum | None = 'True Or False'
    answers : List[QuizQuestionAnswerDisplay] | None = None

    class Config:
        orm_mode = True


class QuizUpdate(QuizCreate):
    questions : List[QuizQuestionDisplay] | None = None

