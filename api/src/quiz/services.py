from sqlalchemy.orm import Session
from src.quiz.models import Quiz
from src.quiz.schemas import QuizCreate, QuizUpdate
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

def get_quiz(db : Session, id: int):
    return db.query(Quiz).filter(Quiz.id == id).first()

def update_quiz(db: Session, db_quiz: Quiz, quiz : QuizUpdate):
    db_quiz.name = quiz.name
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def delete_quiz(db: Session, quiz : Quiz, current_user: User):
    if quiz.author == current_user.id:
        db.delete(quiz)
        db.commit()
        return {'msg':'Quiz deleted.'}
    else:
        return {'msg': 'You must be the author of a quiz to delete it.'}

    