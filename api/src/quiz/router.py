from fastapi import APIRouter, HTTPException, Depends
from src.quiz.schemas import QuizCreate, QuizDisplay, QuizUpdate, QuizQuestionDisplay, QuizQuestionAnswerDisplay
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

@router.delete("/quiz/{id}", tags=['quiz'])
def delete_quiz(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_quiz = services.get_quiz(db, id)
    if db_quiz is None:
        raise HTTPException(404, 'Quiz with that id not found.')
    return services.delete_quiz(db, db_quiz, current_user)

@router.post("/quiz/{quiz_id}/question", response_model=QuizQuestionDisplay, tags=['quiz'])
def create_quiz_question(quiz_id: int, quiz_question: QuizQuestionDisplay, db: Session = Depends(get_db)):
    question = services.create_quiz_question(db, quiz_question, quiz_id)
    if question is None:
        raise HTTPException(404, 'Quiz with that id not found.')
    return question

@router.get("/question/{question_id}", response_model=QuizQuestionDisplay, tags=['quiz'])
def get_quiz_question(question_id: int, db: Session = Depends(get_db)):
    question = services.get_question(db, question_id)
    if question is None:
        raise HTTPException(404, 'Question with that id not found.')
    return question

@router.put("/question/{question_id}", response_model=QuizQuestionDisplay, tags=['quiz'])
def update_quiz_question(question_id: int, quiz_question: QuizQuestionDisplay, db: Session = Depends(get_db)):
    question = services.update_question(db, quiz_question, question_id)
    if question is None:
        raise HTTPException(404, 'Question update failed.')
    return question

@router.delete("/question/{question_id}", tags=['quiz'])
def delete_quiz_question(question_id: int, db: Session = Depends(get_db)):
    deleted_question = services.delete_quiz_question(db, question_id)
    if deleted_question is None:
        raise HTTPException(404, 'No question found with that id.')
    return deleted_question

@router.post("/question/{question_id}/answer", response_model=QuizQuestionAnswerDisplay, tags=['quiz'])
def create_quiz_question_answer(question_id: int, quiz_question_answer: QuizQuestionAnswerDisplay, db: Session = Depends(get_db)):
    quiz_question_answer = services.create_question_answer(db, quiz_question_answer, question_id)
    if quiz_question_answer is None:
        raise HTTPException(404, 'Question with that id not found.')
    return quiz_question_answer


