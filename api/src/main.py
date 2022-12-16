from fastapi import FastAPI
from src.db import Base, engine
from src.auth.router import router as user_router
from src.quiz.router import router as quiz_router

tags_metadata = [
    {
        "name": "auth",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "quiz",
        "description": "Create and manage quizzes.",
    },
]

app = FastAPI()

app.include_router(user_router)
app.include_router(quiz_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
