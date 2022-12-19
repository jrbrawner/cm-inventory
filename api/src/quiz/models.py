from sqlalchemy import String, DateTime, Integer, Column, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from src.db import Base
from src.quiz.constants import QuizTypeEnum
from datetime import datetime
from src.auth.models import User


class Quiz(Base):
    __tablename__ = "Quizzes"
    id = Column(Integer, primary_key=True, index=True)
    author = Column(Integer, ForeignKey(User.id))
    name = Column(String(64))
    description = Column(String())
    num_questions = Column(Integer)
    questions = relationship("QuizQuestion", cascade="all, delete")
    date_created = Column(DateTime, default=datetime.utcnow())


class QuizQuestion(Base):
    __tablename__ = "QuizQuestions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey(Quiz.id), index=True)
    text = Column(String(256))
    type = Column(Enum(QuizTypeEnum))
    answers = relationship("QuizQuestionAnswer", cascade="all, delete")


class QuizQuestionAnswer(Base):
    __tablename__ = "QuizQuestionAnswers"
    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey(Quiz.id), index=True)
    question_id = Column(Integer, ForeignKey(QuizQuestion.id))
    text = Column(String(64))
    correct = Column(Boolean)
