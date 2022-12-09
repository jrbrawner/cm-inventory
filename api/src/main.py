from fastapi import FastAPI
from src.auth.routers import utils, User
from src.db import Base, engine

app = FastAPI()

app.include_router(User.router)
app.include_router(utils.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
