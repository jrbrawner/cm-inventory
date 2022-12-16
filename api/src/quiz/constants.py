import enum

class QuizType(enum.Enum):
    TrueOrFalse = 'True Or False'
    MultipleChoice = 'Multiple Choice'

class QuizTypeModel(enum.Enum):
    TrueOrFalse = 1
    MultipleChoice = 2