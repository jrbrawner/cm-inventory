from fastapi import APIRouter, HTTPException, Depends
from src.quiz.schemas import QuizCreate, QuizDisplay, QuizUpdate
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.auth.models import User
from src.quiz import services

router = APIRouter()


@router.post("/quiz", response_model=QuizCreate, tags=['quiz'])
def create_quiz(
    quiz: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return services.create_quiz(db, quiz, current_user)

@router.get("/quiz/{id}", response_model=QuizDisplay, tags=['quiz'])
def get_quiz(id: int, db: Session = Depends(get_db)):
    quiz = services.get_quiz(db, id)
    if quiz == None:
        raise HTTPException(404, 'Quiz with that id not found.')
    return quiz

@router.put("/quiz/{id}", response_model=QuizUpdate, tags=['quiz'])
def update_quiz(id: int, quiz: QuizUpdate, db: Session = Depends(get_db)):
    db_quiz = services.get_quiz(db, id)
    if db_quiz is None:
        raise HTTPException(404, 'Quiz with that id not found.')
    db_quiz = services.update_quiz(db, db_quiz, quiz)
    return db_quiz
