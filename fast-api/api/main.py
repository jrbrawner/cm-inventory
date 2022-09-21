from fastapi import FastAPI, Depends
from api.routers import utils, User
from api.db import Base, engine
from api.dependencies import get_current_user

app = FastAPI()

app.include_router(User.router)
app.include_router(utils.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


5
