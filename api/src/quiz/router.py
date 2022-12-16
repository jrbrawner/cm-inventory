from fastapi import APIRouter, HTTPException, Depends
from src.quiz.schemas import QuizCreate
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.quiz import services
from src.quiz.constants import QuizType

router = APIRouter()

@router.post('/quiz/{type}', response_model=QuizCreate)
def create_quiz(type : QuizType, quiz : QuizCreate, db : Session = Depends(get_db)):

    if type is QuizType.TrueOrFalse:
        return services.create_true_or_false_quiz(db, quiz)
