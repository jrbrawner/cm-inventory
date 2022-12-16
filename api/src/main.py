from fastapi import FastAPI
from src.auth.router import router as user_router
from src.auth.utils import router as util_router
from src.db import Base, engine
from src.quiz.router import router as quiz_router

app = FastAPI()

app.include_router(user_router)
app.include_router(util_router)
app.include_router(quiz_router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
