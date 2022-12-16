from fastapi import APIRouter, HTTPException, Depends
from src.quiz.schemas import QuizCreate
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.auth.models import User
from src.quiz import services

router = APIRouter()


@router.post("/quiz", response_model=QuizCreate)
def create_quiz(
    quiz: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return services.create_quiz(db, quiz, current_user)
