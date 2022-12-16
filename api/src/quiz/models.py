from sqlalchemy import String, DateTime, Integer, Column, Enum
from src.db import Base
from src.quiz.constants import QuizTypeModel
from datetime import datetime

class QuizModel(Base):
    __tablename__ = 'Quizzes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64))
    description = Column(String())
    type = Column(Enum(QuizTypeModel))
    date_created = Column(DateTime, default=datetime.utcnow())
