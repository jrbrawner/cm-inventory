from sqlalchemy.orm import Session
from src.quiz.models import Quiz
from src.quiz.schemas import QuizCreate
from src.auth.models import User


def create_quiz(db: Session, quiz: QuizCreate, current_user: User):
    db_quiz = Quiz(
        name=quiz.name, description=quiz.description, num_questions=quiz.num_questions
    )
    db_quiz.author = current_user.id
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz
