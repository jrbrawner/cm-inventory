from fastapi import FastAPI

from api.routers import hello_world

app = FastAPI()

app.include_router(hello_world.router)
