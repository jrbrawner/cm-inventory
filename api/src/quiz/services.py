from sqlalchemy.orm import Session
from src.quiz.models import Quiz, QuizQuestion, QuizQuestionAnswer
from src.quiz.schemas import QuizCreate, QuizUpdate, QuizQuestionDisplay, QuizQuestionAnswerDisplay
from src.auth.models import User
from typing import List


def create_quiz(db: Session, quiz: QuizCreate, current_user: User) -> Quiz:
    db_quiz = Quiz(
        name=quiz.name, description=quiz.description, num_questions=quiz.num_questions
    )
    db_quiz.author = current_user.id
    db.add(db_quiz)
    db.commit()
    return db_quiz

def get_quiz(db : Session, id: int) -> Quiz:
    return db.query(Quiz).filter(Quiz.id == id).first()

def update_quiz(db: Session, db_quiz: Quiz, quiz : QuizUpdate) -> Quiz:
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

def create_quiz_question(db: Session, quiz_question: QuizQuestionDisplay, quiz_id: int) -> QuizQuestion:
    quiz = get_quiz(db, quiz_id)
    db_quiz_question = QuizQuestion(quiz_id = quiz.id, text = quiz_question.text, type = quiz_question.type)
    db.add(db_quiz_question)
    db.commit()
    return db_quiz_question

def get_question(db: Session, question_id: int) -> QuizQuestion:
    return db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()

def update_question(db: Session, quiz_question: QuizQuestionDisplay, question_id: int) -> QuizQuestion:
    question = get_question(db, question_id)
    question.text = quiz_question.text
    question.type = quiz_question.type
    db.commit()
    return question

def delete_quiz_question(db: Session, question_id: int):
    quiz_question = get_question(db, question_id)
    db.delete(quiz_question)
    db.commit()
    return {'msg': 'Question deleted.'}
    
def create_question_answer(db: Session, quiz_question_answer: QuizQuestionAnswerDisplay, question_id: int) -> QuizQuestionAnswer:
    question = get_question(db, question_id)
    quiz = get_quiz(db, question.quiz_id)
    db_quiz_question_answer = QuizQuestionAnswer(quiz_id = quiz.id, question_id = question.id, text = quiz_question_answer.text, correct = quiz_question_answer.correct)
    db.add(db_quiz_question_answer)
    question.answers.append(db_quiz_question_answer)
    db.commit()
    return db_quiz_question_answer

def get_question_answers(db: Session, question_id: int) -> List[QuizQuestionAnswer]:
    question = get_question(db, question_id)
    return question.answers

def get_question_answer(db: Session, question_answer_id: int) -> QuizQuestionAnswer:
    quiz_question_answer = db.query(QuizQuestionAnswer).filter(QuizQuestionAnswer.id == question_answer_id).first()
    return quiz_question_answer

def update_question_answer(db: Session, question_answer_id:int, question_answer: QuizQuestionAnswerDisplay) -> QuizQuestionAnswer:
    db_question_answer = get_question_answer(db, question_answer_id)
    if db_question_answer is None:
        return None
    db_question_answer.text = question_answer.text
    db_question_answer.correct = question_answer.correct
    db.commit()
    return db_question_answer

def delete_question_answer(db: Session, question_answer_id: int) -> dict:
    question_answer = get_question_answer(db, question_answer_id)
    if question_answer is None:
        return None
    db.delete(question_answer)
    db.commit()
    return {'msg': 'Question answer deleted.'}


