from sqlalchemy.orm import Session
from src.quiz.models import Quiz, QuizQuestion, QuizQuestionAnswer
from src.quiz.schemas import QuizCreate, QuizUpdate, QuizQuestionDisplay, QuizQuestionAnswerDisplay
from src.auth.models import User



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
    db_quiz_question_answer = QuizQuestionAnswer(quiz_id = question.quiz_id, question_id = question.id, text = quiz_question_answer.text, correct = quiz_question_answer.correct)
    db.add(db_quiz_question_answer)
    question.answers.append(db_quiz_question_answer)
    db.commit()
    return db_quiz_question_answer

