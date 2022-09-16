from fastapi import FastAPI
from api.routers import hello_world, User
from api.db import Base, engine

app = FastAPI()

app.include_router(User.router)
app.include_router(hello_world.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
