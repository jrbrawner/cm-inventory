from sqlalchemy.orm import Session
from src.quiz.models import QuizModel
from src.quiz.schemas import QuizCreate
from src.quiz.constants import QuizTypeModel

def create_true_or_false_quiz(db : Session, quiz : QuizCreate):
    db_quiz = QuizModel(name=quiz.name, description=quiz.description)
    db_quiz.type = QuizTypeModel.TrueOrFalse.value
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz